export const calcluateDays = (periodType, value) => {
  switch (periodType) {
    case 'months':
      return value * 30;

    case 'weeks':
      return value * 7;

    default:
      return value;
  }
};

export const availableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const occupied = 0.65 * totalHospitalBeds;
  const available = totalHospitalBeds - occupied;
  return Math.trunc(available - severeCasesByRequestedTime);
};

export const infectionProjections = (currentlyInfected, days) => {
  const projection = currentlyInfected * (2 ** Math.floor(days / 3));
  return projection;
};

export const moneyLost = (infectionsByRequestedTime, percentageIncome, avgIncome, days) => {
  const estimatedLoss = (infectionsByRequestedTime * percentageIncome * avgIncome) / days;
  return Math.floor(estimatedLoss);
};

export const impactCalculator = ({
  reportedCases,
  totalHospitalBeds,
  periodType,
  timeToElapse,
  region
}, reportedCasesMultiplyer) => {
  const numberOfDays = calcluateDays(periodType, timeToElapse);
  const currentlyInfected = reportedCases * reportedCasesMultiplyer;
  const infectionsByRequestedTime = infectionProjections(currentlyInfected, numberOfDays);
  const severeCasesByRequestedTime = 0.15 * infectionsByRequestedTime;

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime: availableBeds(totalHospitalBeds, severeCasesByRequestedTime),
    casesForICUByRequestedTime: Math.floor(0.05 * infectionsByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.floor(0.02 * infectionsByRequestedTime),
    dollarsInFlight: moneyLost(
      infectionsByRequestedTime,
      region.avgDailyIncomePopulation,
      region.avgDailyIncomeInUSD,
      numberOfDays
    )
  };
};
