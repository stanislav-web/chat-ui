openCapacitorLogin = async b=>{
    const ee = useRuntimeConfig().public.appUrl;
    await Browser.open({
        url: ee + "/api/" + b + "/app",
        presentationStyle: "popover"
    })
}

async function pe(Ee) {
    var Ae;
    le.value = !1,
        oe.value = !0;
    try {
        if (ne)
            await openCapacitorLogin(Ee);
        else {
            const Be = window.open("/api/" + Ee, "targetWindow", "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes");
            await new Promise(Fe=>{
                    const ke = ()=>{
                            setTimeout(()=>{
                                    if (!Be || Be.closed) {
                                        Fe();
                                        return
                                    }
                                    ke()
                                }
                                , 500)
                        }
                    ;
                    ke()
                }
            ),
                window.location.reload()
        }
    } catch (Be) {
        O({
            text: ((Ae = Be.data) == null ? void 0 : Ae.message) || (Be == null ? void 0 : Be.message),
            type: "warn"
        })
    } finally {
        oe.value = !1,
            le.value = !0
    }
}
