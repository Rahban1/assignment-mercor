import { Route as rootRoute } from './routes/__root'
import { Route as SelectionRoute } from './routes/selection'
import { Route as ReportsRoute } from './routes/reports'
import { Route as DashboardRoute } from './routes/dashboard'
import { Route as IndexRoute } from './routes/index'
import { Route as CandidateIdRoute } from './routes/candidate.$id'

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  CandidateIdRoute,
  DashboardRoute,
  ReportsRoute,
  SelectionRoute,
])