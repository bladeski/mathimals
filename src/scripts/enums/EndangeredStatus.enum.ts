export enum EndangeredStatus {
  NOT_EVALUATED = 'Not Evaluated',
  DATA_DEFICIENT = 'Data Deficient',
  LEAST_CONCERN = 'Least Concern',
  NEAR_THREATENED = 'Near Threatened',
  VULNERABLE = 'Vulnerable',
  ENDANGERED = 'Endangered',
  CRITICALLY_ENDANGERED = 'Critically Endangered',
  EXTINCT_IN_THE_WILD = 'Extinct in the Wild',
  EXTINCT = 'Extinct',
}

export function getClassFromEndangeredStatus(status: EndangeredStatus): string {
  switch (status) {
    case EndangeredStatus.LEAST_CONCERN:
    case EndangeredStatus.NEAR_THREATENED:
      return 'success';
    case EndangeredStatus.VULNERABLE:
    case EndangeredStatus.ENDANGERED:
      return 'warning';
    case EndangeredStatus.CRITICALLY_ENDANGERED:
    case EndangeredStatus.EXTINCT_IN_THE_WILD:
      return 'danger';
    case EndangeredStatus.EXTINCT:
      return 'dark';
    default:
      return 'info';
  }
}
