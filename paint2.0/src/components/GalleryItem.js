//this component is for selecting the images from the gallery
import React from 'react'

export default function GalleryItem({src, onSelectImg}) {
    return (
      <img alt='' src={src} onClick={onSelectImg}/>
    )
}
