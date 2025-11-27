'use client'

import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { projectData } from '@/app/data/projects'
import { teilaufmassData } from '@/app/data/teilaufmassData'

export default function EinzelaufmassPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const taid = params.taid as string

  const project = projectData.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Projekt nicht gefunden</h1>
          <Button onClick={() => router.push('/projekte')}>Zurück zur Übersicht</Button>
        </div>
      </div>
    )
  }

  const { teilaufmassinfos } = teilaufmassData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => router.push(`/gesamtaufmass/${projectId}`)}
              className="flex items-center gap-2 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Einzelaufmaß</h1>
              <p className="text-lg text-gray-600">Projekt: {project.name} | Teilaufmaß-ID: {taid}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Project Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              <div>
                <h3 className="font-semibold text-gray-700">Projektname</h3>
                <p className="text-lg">{project.name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Projektnummer</h3>
                <p className="text-lg">{project.number}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Bearbeiter</h3>
                <p className="text-lg">{project.assignee}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teilrechnungen Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Teilrechnungen</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-sm border">LV-Nummer</th>
                    <th className="text-left p-4 font-semibold text-sm border">Kurztext</th>
                    <th className="text-center p-4 font-semibold text-sm border">Menge lt. Auftrag</th>
                    <th className="text-center p-4 font-semibold text-sm border">Menge {taid} TR</th>
                    <th className="text-center p-4 font-semibold text-sm border">Einheit</th>
                    {Array.from({ length: Math.max(...teilaufmassinfos.map(item => item.beilagen.length)) }).map(
                      (_, index) => (
                        <th key={index} className="text-center p-4 font-semibold text-sm border">
                          Beilage {index + 1}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {teilaufmassinfos.map((item) => (
                    <tr key={item.lvNummer} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium border">{item.lvNummer}</td>
                      <td className="p-4 text-sm border">{item.kurztext}</td>
                      <td className="p-4 text-sm text-center border">{item.mengen[0]}</td>
                      <td className="p-4 text-sm text-center border">{item.mengen[1] || 0}</td>
                      <td className="p-4 text-sm text-center border">{item.einheit}</td>
                      {item.beilagen.map((beilage, index) => (
                        <td key={index} className="p-4 text-sm text-center border">{beilage}</td>
                      ))}
                      {Array.from({ length: Math.max(...teilaufmassinfos.map(i => i.beilagen.length)) - item.beilagen.length }).map(
                        (_, index) => (
                          <td key={`empty-${index}`} className="p-4 text-sm text-center border">-</td>
                        )
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}