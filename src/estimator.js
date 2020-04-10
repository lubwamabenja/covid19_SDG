import {
  prototypeEstimator
} from './functions';

const covid19ImpactEstimator = (data) => ({
  data,
  impact: prototypeEstimator({ ...data }, 10),
  severeImpact: prototypeEstimator({ ...data }, 50)
});

export default covid19ImpactEstimator;
