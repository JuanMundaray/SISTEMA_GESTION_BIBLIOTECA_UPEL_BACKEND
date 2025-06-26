# Usa una imagen oficial de Node.js como base
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala solo las dependencias de desarrollo
RUN npm install --only=dev

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto (ajusta si usas otro puerto)
EXPOSE 3000

# Comando para iniciar la aplicación (ajusta si usas app.js o server.js)
CMD ["node", "server.js"]