# Imagem base: servidor web Nginx em versão leve (Alpine Linux)
FROM nginx:alpine

# Copia os arquivos do projeto para a pasta que o Nginx serve
COPY . /usr/share/nginx/html