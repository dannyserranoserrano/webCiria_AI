#!/bin/bash

# Script para convertir imágenes a WebP en una carpeta y sus subcarpetas
# Uso: ./convertir_a_webp.sh /ruta/carpeta calidad borrar_originales
# Ejemplo: ./convertir_a_webp.sh /home/usuario/fotos 85 si

# Parámetros
CARPETA="$1"
CALIDAD="$2"
BORRAR="$3"

# Comprobaciones
if [ -z "$CARPETA" ] || [ -z "$CALIDAD" ]; then
    echo "Uso: $0 /ruta/carpeta calidad borrar_originales(si/no)"
    exit 1
fi

if ! command -v magick &>/dev/null; then
    echo "ImageMagick no está instalado. Instalando..."
    sudo apt update && sudo apt install -y imagemagick
fi

echo "Convirtiendo imágenes en: $CARPETA"
echo "Calidad: $CALIDAD"
echo "Borrar originales: $BORRAR"

# Buscar y convertir (añadidos más formatos)
find "$CARPETA" -type f \( \
    -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o \
    -iname "*.gif" -o -iname "*.bmp" -o -iname "*.tif" -o -iname "*.tiff" -o \
    -iname "*.heic" -o -iname "*.heif" -o -iname "*.jfif" -o -iname "*.ppm" -o \
    -iname "*.pgm" -o -iname "*.pbm" -o -iname "*.pnm" \
\) | while read -r img; do
    salida="${img%.*}.webp"
    echo "Convirtiendo: $img → $salida"
    magick "$img" -quality "$CALIDAD" "$salida"

    if [ "$BORRAR" = "si" ]; then
        rm "$img"
        echo "Original eliminado: $img"
    fi
done

echo "✅ Conversión finalizada."
