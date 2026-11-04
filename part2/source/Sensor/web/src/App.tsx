import './App.css'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Toaster } from "@/components/ui/toaster"

import OBU_table from './components/obu_table'

function App() {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">C-V2X Data Simulator</h1>
      <Tabs defaultValue="obu" className="w-full">
        <TabsList>
          <TabsTrigger value="obu">OBU</TabsTrigger>
        </TabsList>
        <TabsContent value="obu" className='w-full'>
          <OBU_table />
        </TabsContent>
      </Tabs>
      <Toaster />
    </>
  )
}

export default App
