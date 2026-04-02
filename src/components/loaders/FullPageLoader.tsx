import { LOTTIES } from '@/assets/lotties'
import React from 'react'
import { Player } from '@lottiefiles/react-lottie-player';
type Props = {}

export const FullPageLoader = (props: Props) => {
  return (
    <div>
      <Player
          autoplay
          loop
          src={LOTTIES.hotelLoading} // Replace with your Lottie JSON URL or path
          style={{ height: '300px', width: '300px' }}
        ></Player>
    </div>
  )
}