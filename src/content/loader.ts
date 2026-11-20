import catalogJson from '../../content/catalog.json'
import moduleJson from '../../content/modules/m01/module.json'
import quizJson from '../../content/modules/m01/quiz.json'
import meetHydrogen from '../../content/modules/m01/stations/meet-hydrogen.json'
import bondingLab from '../../content/modules/m01/stations/bonding-lab.json'
import greenElectrolyzer from '../../content/modules/m01/stations/green-electrolyzer.json'
import energyCarrier from '../../content/modules/m01/stations/energy-carrier.json'
import type {
  CourseCatalog,
  ModuleDefinition,
  ModulePack,
  QuizDefinition,
  StationDefinition,
} from './types'

const stationMap: Record<string, StationDefinition[]> = {
  m01: [
    meetHydrogen as StationDefinition,
    bondingLab as StationDefinition,
    greenElectrolyzer as StationDefinition,
    energyCarrier as StationDefinition,
  ],
}

const moduleMap: Record<string, ModuleDefinition> = {
  m01: moduleJson as ModuleDefinition,
}

const quizMap: Record<string, QuizDefinition> = {
  m01: quizJson as QuizDefinition,
}

export const getCatalog = (): CourseCatalog => catalogJson as CourseCatalog

export const loadModulePack = (moduleId: string): ModulePack | null => {
  const module = moduleMap[moduleId]
  const quiz = quizMap[moduleId]
  const stations = stationMap[moduleId]
  if (!module || !quiz || !stations) return null

  const ordered = module.stationOrder
    .map((id) => stations.find((station) => station.id === id))
    .filter((station): station is StationDefinition => Boolean(station))

  return { module, stations: ordered, quiz }
}

export const listPlayableModuleIds = (): string[] =>
  getCatalog().modules.filter((module) => !module.locked).map((module) => module.id)
