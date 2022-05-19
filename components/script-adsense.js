import { useState } from 'react'
import Script from 'next/script'

export default function ScriptAdSense() {
  return (

/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9890924604571133"
        crossorigin="anonymous"></script>       */
    <>
      <Script
        id="Adsense-id"
        data-ad-client="ca-pub-9890924604571133"
        async="true"
        strategy="beforeInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        onError={(e) => {
            console.error('Script failed to load', e)
        }}
      />
    </>
  )
}