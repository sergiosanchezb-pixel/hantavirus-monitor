interface FooterProps {
  serverTime?: string;
  locale?: 'es' | 'en';
}

export default function Footer({ serverTime, locale = 'es' }: FooterProps) {
  const currentTime = serverTime || new Date().toLocaleTimeString(locale === 'en' ? 'en-US' : 'es-ES');
  const isEn = locale === 'en';

  return (
    <footer className="footer">
      <p>█ HANTAMONITOR – {isEn ? 'INDEPENDENT PRIVATE INITIATIVE' : 'INICIATIVA PRIVADA INDEPENDIENTE'} █</p>
      <p>WHO &nbsp;|&nbsp; CDC &nbsp;|&nbsp; ProMED &nbsp;|&nbsp; ECDC</p>
      <p>{isEn ? 'NOT AN OFFICIAL SOURCE – FOR INFORMATIONAL REFERENCE ONLY' : 'NO ES FUENTE OFICIAL – SOLO REFERENCIA INFORMATIVA'}</p>
      <p>{isEn ? 'LAST SERVER SYNC' : 'ÚLTIMA SYNC SERVIDOR'}: {currentTime}</p>
    </footer>
  );
}
