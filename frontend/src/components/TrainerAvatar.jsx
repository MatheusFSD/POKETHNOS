import sheet from '../assets/treinadores.png';

/** Grid da prancha: 3 colunas x 2 linhas. */
export const TRAINER_COLS = 3;
export const TRAINER_ROWS = 2;
export const TRAINER_COUNT = TRAINER_COLS * TRAINER_ROWS;

/**
 * Largura ÷ altura da célula (364x400). A prancha foi recortada pela união
 * das seis silhuetas: antes cada célula era quadrada e 54% dela era vazio
 * transparente, o que deixava a caixa do elemento muito maior que o
 * personagem visível.
 */
export const TRAINER_ASPECT = 364 / 400;

export const TRAINER_NAMES = [
  'Boné Laranja',
  'Tranças',
  'Pesquisador',
  'Mecha Roxa',
  'Cabelo Prata',
  'Macacão',
];

/**
 * Um treinador recortado da prancha única, por background-position.
 *
 * `size` é a ALTURA; a largura vem da proporção da célula, para o
 * personagem nunca distorcer.
 */
export default function TrainerAvatar({ index = 0, size = 40, className = '', title }) {
  const i = ((index % TRAINER_COUNT) + TRAINER_COUNT) % TRAINER_COUNT;
  const col = i % TRAINER_COLS;
  const row = Math.floor(i / TRAINER_COLS);

  return (
    <span
      className={`trainer${className ? ` ${className}` : ''}`}
      title={title ?? TRAINER_NAMES[i]}
      style={{
        width: Math.round(size * TRAINER_ASPECT),
        height: size,
        backgroundImage: `url(${sheet})`,
        backgroundSize: `${TRAINER_COLS * 100}% ${TRAINER_ROWS * 100}%`,
        backgroundPosition: `${col * (100 / (TRAINER_COLS - 1))}% ${row * 100}%`,
      }}
    />
  );
}
