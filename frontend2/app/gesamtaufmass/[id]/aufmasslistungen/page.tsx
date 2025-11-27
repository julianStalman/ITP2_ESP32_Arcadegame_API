'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { projectData } from '@/app/data/projects'
import { aufmassData } from '@/app/data/aufmassData'

export default function AufmasslistungenPage() {
  const [searchTerm, setSearchTerm] = useState('') // State for search term
  const [dropdownOpen, setDropdownOpen] = useState(false) // State for dropdown visibility
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

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

  // Filtered data based on search term
  const filteredData = aufmassData.teilaufmassinfos.filter((item) =>
    item.lvNummer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kurztext.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <h1 className="text-2xl font-bold text-gray-900">Teilaufmaßlistungen</h1>
              <p className="text-lg text-gray-600">{project.name}</p>
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

        {/* Combined Search and Actions Card */}
        <Card className="mb-6">
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              {/* Search Section */}
              <div className="flex-1">
                <h3 className="font-medium text-gray-700 mb-2">LV-Nummer Suchen</h3>
                <Input
                  type="text"
                  placeholder="LV-Nummer oder Kurztext suchen"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:max-w-md"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="relative">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                Teilaufmaß auswählen
                </Button>
                {dropdownOpen && (
                  <div className="absolute bg-white border shadow-md mt-2 rounded-md z-10">
                    {aufmassData.teilaufmasse.map((teilaufmass) => (
                      <button
                        key={teilaufmass.taid}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        onClick={() => {
                          setDropdownOpen(false)
                          router.push(`/gesamtaufmass/${projectId}/aufmasslistungen/einzelneaufmasslistung/${teilaufmass.taid}`)
                        }}
                      >
                        {teilaufmass.taid}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold text-sm">LV-Nummer</th>
                    <th className="text-left p-4 font-semibold text-sm">Kurztext</th>
                    {aufmassData.teilaufmasse.map((teilaufmass, index) => (
                      <th key={index} className="text-center p-4 font-semibold text-sm">
                        Menge {teilaufmass.taid}. TR
                      </th>
                    ))}
                    <th className="text-center p-4 font-semibold text-sm">Menge SR</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.lvNummer} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm font-medium">{item.lvNummer}</td>
                      <td className="p-4 text-sm">{item.kurztext}</td>
                      {item.mengen.map((menge, mengeIndex) => (
                        <td key={mengeIndex} className="p-4 text-sm text-center">
                          {menge}
                        </td>
                      ))}
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