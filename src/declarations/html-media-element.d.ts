// html-media-element.d.ts
declare interface HTMLMediaElement {
    setSinkId?: (sinkId: string) => Promise<undefined>
    sinkId?: string
}
