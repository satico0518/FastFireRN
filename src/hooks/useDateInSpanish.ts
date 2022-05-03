const days = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];
const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const useDateInSpanish = () => {
  const date = new Date();
  return `${days[date.getDay()]} ${date.getDate()} de ${
    months[date.getMonth()]
  }`;
};

export default useDateInSpanish;
