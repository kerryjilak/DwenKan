/**
 * API client — runs simulations locally in the browser
 * (no backend server required).
 */

import { simulateLIFNeuron } from '../engines/lifNeuron';
import { simulateNetwork as runNetwork } from '../engines/networkSim';
import { runForwardPass } from '../engines/aiEngine';

export async function simulateNeuron(params) {
  return simulateLIFNeuron(params);
}

export async function simulateNetwork(params) {
  return runNetwork(params);
}

export async function simulateAI(params) {
  return runForwardPass(params);
}
