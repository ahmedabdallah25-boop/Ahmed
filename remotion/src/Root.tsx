import React from 'react';
import {Composition} from 'remotion';
import {Short, shortSchema} from './Short';
import {
  FPS,
  Voiceover,
  calculateVoiceoverMetadata,
  voiceoverSchema,
} from './Voiceover';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={Short}
        schema={shortSchema}
        durationInFrames={FPS * 45}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          source: '',
          cards: [
            {text: 'Your bank', from: 0, to: 0.8, band: 0.35},
            {text: 'is not', from: 0.8, to: 1.4, band: 0.35},
            {text: 'your friend', from: 1.4, to: 2.4, band: 0.35},
          ],
        }}
      />

      {/* Length and captions both come from the audio — see calculateVoiceoverMetadata. */}
      <Composition
        id="Voiceover"
        component={Voiceover}
        schema={voiceoverSchema}
        calculateMetadata={calculateVoiceoverMetadata}
        durationInFrames={FPS * 30}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          audio: 'voice.mp3',
          cards: [],
          broll: '',
          accent: '#19c37d',
          handle: '@Financeundoubtlydecoded',
        }}
      />
    </>
  );
};
