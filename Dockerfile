FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY . /usr/share/nginx/html

RUN echo "server { listen 80; location / { root /usr/share/nginx/html; index index.html; } location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { root /usr/share/nginx/html; expires 1y; add_header Cache-Control 'public'; } }" > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]