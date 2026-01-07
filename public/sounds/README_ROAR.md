# Som de Rugido para Ratel Furioso

Para adicionar o som de rugido, você precisa baixar um arquivo de áudio MP3.

## Opção 1: Baixar de um site gratuito

Visite um destes sites e baixe um som de rugido de leão:
- https://pixabay.com/sound-effects/search/lion-roar/
- https://freesound.org/search/?q=lion+roar
- https://www.zapsplat.com/sound-effect-category/animals/

## Opção 2: Usar IA para gerar

Use um gerador de áudio IA como:
- https://elevenlabs.io/sound-effects
- Prompt: "Fierce lion roar, aggressive, powerful, 3-5 seconds"

## Instalação

1. Baixe o arquivo MP3
2. Renomeie para `roar.mp3`
3. Coloque em: `c:/Users/victo/Downloads/Ratel/public/sounds/roar.mp3`
4. Crie a pasta `sounds` se não existir

## Uso no Código

O código já está preparado para usar:
```typescript
const audio = new Audio('/sounds/roar.mp3');
audio.volume = 0.7;
audio.play();
```

**Nota**: O arquivo de áudio não pode ser gerado automaticamente por mim, mas você pode baixá-lo facilmente dos sites acima.
