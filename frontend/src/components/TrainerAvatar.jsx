import sheet from '../assets/treinadores.png';

/** Grid da prancha: 3 colunas x 2 linhas, células de mesma altura. */
export const TRAINER_COLS = 3;
export const TRAINER_ROWS = 2;
export const TRAINER_COUNT = TRAINER_COLS * TRAINER_ROWS;

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
 * Todos os seis vivem no mesmo PNG: a célula é escolhida em porcentagem
 * (0% / 50% / 100% na horizontal, 0% / 100% na vertical), então o mesmo
 * arquivo serve qualquer tamanho de exibição sem cortes fixos em pixels.
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
        width: size,
        height: size,
        backgroundImage: `url(${sheet})`,
        backgroundSize: `${TRAINER_COLS * 100}% ${TRAINER_ROWS * 100}%`,
        backgroundPosition: `${col * (100 / (TRAINER_COLS - 1))}% ${row * 100}%`,
      }}
    />
  );
}
