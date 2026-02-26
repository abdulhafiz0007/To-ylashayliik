// Utility to crop image using canvas
export async function getCroppedImg(
    imageSrc: string,
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
): Promise<File> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const outputSize = 512
    canvas.width = outputSize
    canvas.height = outputSize

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputSize,
        outputSize
    )

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                resolve(new File([blob!], 'cropped.jpg', { type: 'image/jpeg' }))
            },
            'image/jpeg',
            0.85
        )
    })
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (err) => reject(err))
        image.setAttribute('crossOrigin', 'anonymous')
        image.src = url
    })
}
