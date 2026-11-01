# Visual project

Panel web para organizar un ingreso mensual por categorias como comida, vivienda, ahorro y ocio.

## Ejecutar en local

```bash
npm install
npm run dev
```

La informacion se guarda en `localStorage` del navegador. Esta primera version no necesita una base de datos ni una cuenta.

## Crear una version para publicar

```bash
npm run build
```

El resultado queda en la carpeta `dist`.

## Publicar con una direccion propia

1. Sube este proyecto a un repositorio en GitHub.
2. En Vercel o Netlify, importa ese repositorio.
3. Configura el comando de build como `npm run build` y la carpeta de salida como `dist`.
4. La plataforma te dara una direccion temporal para probar la pagina.
5. Compra un dominio disponible, por ejemplo `organizer.com`, en un registrador de dominios.
6. Desde la seccion de dominios de Vercel o Netlify, anade el dominio y sigue los registros DNS que te indiquen.

El dominio y el alojamiento son servicios separados: el dominio es la direccion y Vercel/Netlify publica los archivos de la aplicacion.
