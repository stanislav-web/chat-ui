import { type IUserIce } from '@interfaces/user/i.user-ice';
import { WebrtcConfig } from '@configuration/webrtc.config';
import { AppConfig } from '@configuration/app.config';
import { decryptMessage, encryptMessage } from '@functions/crypt.function';
import { type Socket } from 'socket.io-client';
import { RtcConnectionStateEnum } from '@enums/rtc-connection-state.enum';
import { RtcSignallingStateEnum } from '@enums/rtc-signalling-state.enum';
import { PeerException } from '@exceptions/peer.exception';
import { type SocketEmitType, type SocketListenType } from '@types/socket.type';
import { type IEventEmitAnswer, type IEventEmitCandidate, type IEventEmitOffer, type IEventEmitStop } from '@interfaces/socket/i.event-emit';
import { EventEmitEnum } from '@enums/event-emit.enum';
import { type IEventListenCandidate } from '@interfaces/socket/i.event-listen';
import { v4 as uuid } from 'uuid';
import { EventListenEnum } from '@enums/event-listen.enum';
import { onTrack } from '@events/peer.event';

/**
 * PeerConnection app class
 * @module components
 */
export class PeerConnection {
  /**
   * @type {RTCConfiguration} config
   * @private
   * @readonly
   */
  private readonly config: RTCConfiguration = WebrtcConfig;

  /**
   * RTCPeerConnection
   * @type {RTCPeerConnection} peer
   * @private
   */
  private peer: RTCPeerConnection = null;

  /**
   * RTCDataChannel
   * @type {RTCDataChannel} channel
   * @private
   */
  private channel: RTCDataChannel = null;

  /**
   * RTCIceCandidate[]
   * @type {Array<RTCIceCandidate>} candidates
   * @readonly
   * @private
   */
  private candidates: RTCIceCandidate[] = [];

  /**
   * @type {Socket} transport
   * @private
   * @readonly
   */
  private readonly transport: Socket = null;

  /**
   * HTMLVideoElement
   * @type {HTMLVideoElement} track
   * @private
   */
  private readonly track: HTMLVideoElement = null;

  /**
   * Encryption
   * @type {boolean} encryption
   * @private
   */
  private readonly encryption: boolean = false;

  /**
   * PeerConnection
   * @param {Socket} transport
   * @param {HTMLVideoElement} track
   * @param {Array<IUserIce>} [iceServers]
   */
  constructor(transport: Socket, track: HTMLVideoElement, iceServers?: IUserIce[]) {
    this.encryption = AppConfig.isDecrypt;
    this.config = iceServers
      ? {
          ...this.config,
          iceServers: iceServers.map((ice: IUserIce) => ({
            urls: this.encryption ? decryptMessage(ice.urls) : ice.urls,
            username: this.encryption ? decryptMessage(ice?.username) : ice.username,
            credential: this.encryption ? decryptMessage(ice?.credential) : ice.credential
          }))
        }
      : WebrtcConfig;
    this.transport = transport;
    this.track = track;
  }

  /**
   * Is peer ready for offer
   * @private
   * @return boolean
   */
  private isPeerReadyForOffer (): boolean {
    return this.peer.connectionState === RtcConnectionStateEnum.NEW &&
        this.peer.signalingState === RtcSignallingStateEnum.STABLE;
  }

  /**
   * Create peer connection
   * @public
   * @return Promise<RTCPeerConnection>
   */
  async createPeer(): Promise<RTCPeerConnection> {
    if (!this.peer) {
      const certificate = await RTCPeerConnection.generateCertificate({
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1])
      });

      this.peer = new RTCPeerConnection({
        certificates: [certificate],
        ...this.config
      });
    }
    this.peer.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      this.candidates.push(event.candidate)
    }
    this.peer.ontrack = (event: RTCTrackEvent) => {
      onTrack(this.track, event.track, event.streams);
    }
    return this.peer;
  }

  /**
   * Track peer connection
   * @param {any} cb
   * @param {any} error
   * @public
   * @return void
   */
  trackPeer(cb: any, error: any): void {
    if (this.peer) {
      this.peer.onconnectionstatechange = () => {
        if (this.peer.connectionState === RtcConnectionStateEnum.FAILED) {
          this.peer.restartIce();
          error({ name: 'Peer Connection', message: 'Restart due to failed connection' })
        }
        if (this.peer.connectionState === RtcConnectionStateEnum.CONNECTED) {
          cb(this.peer)
        }
      }
    }
  }

  /**
   * Track data channel
   * @public
   * @return void
   */
  trackDataChannel(): void {
    if (this.peer) {
      this.peer.ondatachannel = (event: RTCDataChannelEvent) => {
        this.channel = event.channel;
        this.channel.onopen = () => { console.log('[!] Data Channel open'); }
        this.channel.onmessage = (event: MessageEvent) => { console.log('[!] Data Channel message', event.data); }
      }
    }
  }

  /**
   * Get peer connection
   * @public
   * @return RTCPeerConnection
   */
  getPeer(): RTCPeerConnection {
    return this.peer;
  }

  /**
   * Add ICE candidate
   * @param {RTCIceCandidate} candidate
   * @public
   * @return Promise<void>
   */
  addCandidate(candidate: RTCIceCandidate): Promise<void> {
    candidate = this.encryption
      ? {
          candidate: decryptMessage(candidate.candidate),
          sdpMLineIndex: candidate.sdpMLineIndex,
          sdpMid: candidate.sdpMid,
          usernameFragment: candidate.usernameFragment
        }
      : candidate;
    return this.peer.addIceCandidate(new RTCIceCandidate(candidate));
  }

  /**
   * Get ICE candidates
   * @public
   * @return Array<RTCIceCandidate>
   */
  getCandidates(): RTCIceCandidate[] {
    return this.candidates;
  }

  /**
   * Set remote description
   * @param {RTCSessionDescriptionInit} description
   * @public
   * @return Promise<void>
   */
  setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void> {
    description = this.encryption
      ? {
          sdp: decryptMessage(description.sdp),
          type: description.type
        }
      : description;

    return this.peer.setRemoteDescription(new RTCSessionDescription(description))
  }

  /**
   * Create data channel
   * @public
   * @return RTCDataChannel
   */
  createDataChanel(): RTCPeerConnection {
    if (!this.peer) throw new PeerException('Cannot create channel without peer');
    if (!this.channel) {
      this.channel = this.peer.createDataChannel(uuid(), {
        ordered: true,
        maxRetransmits: 3
      });
    }
    return this.channel;
  }

  /**
   * Send peer offer
   * @throws PeerException
   * @public
   * @return Promise<RTCLocalSessionDescriptionInit>
   */
  async sendOffer(): Promise<RTCLocalSessionDescriptionInit> {
    if (this.isPeerReadyForOffer()) {
      try {
        const offer = await this.peer.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
          voiceActivityDetection: true
        });
        await this.peer.setLocalDescription(offer);
        this.transport.emit<SocketEmitType, IEventEmitOffer>(EventEmitEnum.OFFER, this.encryption
          ? {
              type: offer.type,
              sdp: encryptMessage(offer.sdp)
            }
          : offer);
        setTimeout(() => {
          this.sendCandidates();
          console.log('[!] OFFER:', offer);
          console.log('[!] CANDIDATES:', this.candidates);
        }, 300);

        return offer;
      } catch (error: any) {
        const typedError = error as DOMException;
        throw new PeerException(typedError?.message, error);
      }
    } else throw new PeerException('Peer is not ready for Send Offer');
  }

  /**
   * Send peer answer
   * @param {RTCSessionDescriptionInit} description
   * @throws PeerException
   * @public
   * @return Promise<RTCLocalSessionDescriptionInit>
   */
  async sendAnswer(description: RTCSessionDescriptionInit): Promise<RTCLocalSessionDescriptionInit> {
    try {
      await this.setRemoteDescription(description);
      const answer = await this.peer.createAnswer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      await this.peer.setLocalDescription(answer);
      this.transport.emit<SocketEmitType, IEventEmitAnswer>(EventEmitEnum.ANSWER, this.encryption
        ? {
            type: answer.type,
            sdp: encryptMessage(answer.sdp)
          }
        : answer);
      console.log('[!] ANSWER:', answer);
      return answer;
    } catch (error: any) {
      const typedError = error as DOMException;
      throw new PeerException(typedError?.message, error);
    }
  }

  /**
   * Send peer candidates
   * @public
   * @return void
   */
  sendCandidates(): void {
    if (this.candidates.length > 0) {
      // this.candidates.forEach(function(candidate) {
      //   const d = candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g);
      //   console.log('[!] d:', d);
      // });
      const candidates = this.encryption
        ? this.candidates.map((candidate) => ({
          candidate: encryptMessage(candidate.candidate),
          sdpMLineIndex: candidate.sdpMLineIndex,
          sdpMid: candidate.sdpMid,
          usernameFragment: candidate.usernameFragment
        }))
        : this.candidates;
      this.transport.emit<SocketEmitType, IEventEmitCandidate>(EventEmitEnum.CANDIDATES, candidates);
    }
    this.candidates = [];
  }

  /**
   * Close all connections
   */
  close(): void {
    this.channel?.close();
    this.peer?.close()
    this.transport.emit<SocketEmitType, IEventEmitStop>(EventEmitEnum.STOP);
    this.transport.off<SocketListenType, IEventListenCandidate>(EventListenEnum.OFFER);
    this.transport.off<SocketListenType, IEventListenCandidate>(EventListenEnum.ANSWER);
    this.transport.off<SocketListenType, IEventListenCandidate>(EventListenEnum.CANDIDATE);
    this.peer = null;
    this.channel = null;
  }
}
