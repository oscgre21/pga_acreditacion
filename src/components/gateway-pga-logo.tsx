import Image from "next/image";

export const PgaLogo = () => (
    <div className="flex flex-col items-center text-center">
      <Image
        src="https://pga.appcesac.com/images/login/logo_pga.png"
        alt="Portal de Gestión Administrativa Logo"
        width={250}
        height={250}
        priority
      />
    </div>
  );
