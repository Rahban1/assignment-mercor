import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import { z } from 'zod'
import React, { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useHiringStore } from './store'
import { extractFilterOptions } from './utils/data-processing'
import CandidateCard from './components/features/CandidateCard'
import FilterPanel from './components/features/FilterPanel'
import Card, { CardContent } from './components/ui/Card'
import Button from './components/ui/Button'
import Badge from './components/ui/Badge'

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <div id="root-outlet" />
    </div>
  ),
})

// Dashboard search schema
const dashboardSearchSchema = z.object({
  search: z.string().optional().default(''),
  locations: z.array(z.string()).optional().default([]),
  workAvailability: z.array(z.string()).optional().default([]),
  minExperience: z.coerce.number().optional().default(0),
  maxSalary: z.coerce.number().optional().default(999999),
  educationLevel: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
  isShortlisted: z.boolean().nullable().optional(),
  isSelected: z.boolean().nullable().optional(),
  view: z.enum(['grid', 'list']).optional().default('grid'),
})

// Index route (redirect to dashboard)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => {
    window.location.href = '/dashboard'
    return null
  },
})

// Dashboard route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  validateSearch: dashboardSearchSchema,
  component: () => {
    // Dashboard component logic here - simplified for now
    return <div>Dashboard Loading...</div>
  },
})

// Candidate detail route
const candidateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/candidate/$id',
  component: () => {
    return <div>Candidate Detail</div>
  },
})

// Selection route
const selectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/selection',
  component: () => {
    return <div>Team Selection</div>
  },
})

// Reports route
const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: () => {
    return <div>Reports & Analytics</div>
  },
})

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  candidateRoute,
  selectionRoute,
  reportsRoute,
])

// Create router
export const router = createRouter({ routeTree })

// Augment module for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}