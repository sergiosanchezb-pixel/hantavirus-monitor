interface FooterProps {
  serverTime?: string;
}

export default function Footer({ serverTime }: FooterProps) {
  const currentTime = serverTime || new Date().toLocaleTimeString('es-ES');

  return (
    <footer className="footer">
      <p>█ HANTAMONITOR – INICIATIVA PRIVADA INDEPENDIENTE █</p>
      <p>OMS &nbsp;|&nbsp; CDC &nbsp;|&nbsp; ProMED &nbsp;|&nbsp; ECDC</p>
      <p>NO ES FUENTE OFICIAL – SOLO REFERENCIA INFORMATIVA</p>
      <p>ÚLTIMA SYNC SERVIDOR: {currentTime}</p>
    </footer>
  );
}
