'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, Download, ArrowRight, LogOut } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { projectData } from '@/app/data/projects'

export default function GesamtaufmassPage() {
  const handleLogout = () => {
    alert('Erfolgreich abgemeldet!')
    
    router.push('/login')
  }
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

  const [searchTerm, setSearchTerm] = useState('')
  const [notesPopupVisible, setNotesPopupVisible] = useState(false)
  const [importPopupVisible, setImportPopupVisible] = useState(false)
  const [selectedNote, setSelectedNote] = useState('')

  const filteredMeasurements = project.gesamtaufmasinfos.filter((item) =>
    item.lvNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.shortText.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenNotes = (note: string) => {
    setSelectedNote(note)
    setNotesPopupVisible(true)
  }

  const closeNotesPopup = () => {
    setNotesPopupVisible(false)
    setSelectedNote('')
  }

  const openImportPopup = () => {
    setImportPopupVisible(true)
  }

  const closeImportPopup = () => {
    setImportPopupVisible(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/projekte')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Alle Projekte
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gesamtaufmaß</h1>
                <p className="text-lg text-gray-600">{project.name}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Ausloggen
            </Button>
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
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => router.push(`/gesamtaufmass/${projectId}/aufmasslistungen`)}
                >
                  Aufmaßlistungen
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={openImportPopup}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Artikelliste Importieren
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportieren
                </Button>


              </div>
            </div>
          </CardContent>
        </Card>

        {/* Measurement Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">LV-Nummer</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Kurztext</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Notizen</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Positionart</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Menge II. Auftrag</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Menge SR-Antal</th>
                    <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Einheit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeasurements.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-2 text-sm">{item.lvNumber}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{item.shortText}</td>
                      <td
                        className="border border-gray-200 px-4 py-2 text-sm cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => handleOpenNotes(item.notes)}
                      >
                        <span className="text-blue-600 hover:text-blue-800">Notizen öffnen</span>
                      </td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{item.positionType}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-right">{item.quantityOrder}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm text-right">{item.quantitySRAnteil}</td>
                      <td className="border border-gray-200 px-4 py-2 text-sm">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes Popup Overlay */}
      {notesPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={closeNotesPopup}
          />
          
          {/* Notes Popup Content */}
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-96 max-w-[90vw] z-10 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Notizen 0201850801A</h2>
              <button 
                onClick={closeNotesPopup} 
                className="text-gray-500 hover:text-gray-700 transition-colors text-lg"
              >
                ✖
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Hier sind die Notizen für den ausgewählten Artikel</p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Bearbeiten</h3>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 min-h-[100px]">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedNote || 'Neue Notizen hier schreiben'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button>
                Fertigstellen
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Popup Overlay */}
      {importPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            onClick={closeImportPopup}
          />
          
          {/* Import Popup Content */}
          <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Artikelliste Importieren</h2>
              <button 
                onClick={closeImportPopup} 
                className="text-gray-500 hover:text-gray-700 transition-colors text-lg"
              >
                ✖
              </button>
            </div>
            
            <div className="space-y-6">
              {/* File Selection Section */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Datei auswählen</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Input 
                    type="text" 
                    placeholder="Dateipfad ist hier" 
                    className="flex-1"
                  />
                  <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
                    <Upload className="h-4 w-4" />
                    Hochladen
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}