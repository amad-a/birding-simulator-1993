precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uTexture;

uniform vec2 uScale;

void main() {

  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  // This is the formula for pixellation of uvs
  vec2 pixelUv = floor(uv * uScale) / uScale;
  
  // Plug it into texture2d
  vec4 color = texture2D(uTexture, pixelUv);
  
  // Send the color to the screen
  gl_FragColor = color;

}
