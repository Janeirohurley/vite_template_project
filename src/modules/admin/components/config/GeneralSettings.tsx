import { CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/Textarea"
import { KeywordInput } from "./KeywordInput"
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown"
import { ImageIcon } from "lucide-react"

export function GeneralSettings() {
    return (


        <CardContent className="space-y-6 w-full">

            {/* Nom de l'application */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Nom de l'application</Label>
                <Input placeholder="UMS — University Management System" />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                    rows={3}
                    placeholder="Système moderne de gestion universitaire"
                    className="resize-none"
                />
            </div>

            <KeywordInput />


            <div className="flex gap-1.5">
                {/* Logo */}
                <div className="space-y-2 flex-3 ">
                    <Label className="text-sm font-medium">Logo de l'application</Label>

                    <div className="flex items-center gap-4">
                        <div className="w-full h-30 rounded-lg border border-dashed flex items-center justify-center bg-gray-50">

                            <label htmlFor="favicon"> <ImageIcon className="w-10 h-10 text-gray-400" /></label>
                        </div>

                        <Input id="favicon" type="file" className="w-full hidden" />
                    </div>
                </div>

                {/* Favicon */}
                <div className="space-y-2 flex-2">
                    <Label className="text-sm font-medium">Favicon</Label>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-md border border-dashed flex items-center justify-center bg-gray-50">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                        </div>

                        <Input type="file" className="w-full  hidden" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* Fuseau horaire */}

                <SingleSelectDropdown
                    label="Fuseau horaire"
                    options={[
                        {
                            id: "1",
                            label: "Europe/Paris (GMT+1)",
                            value: "Europe/Paris"
                        },
                        {
                            id: "2",
                            label: "Europe/London (GMT+0)",
                            value: "Europe/London"
                        }
                    ]}
                    onChange={() => { }}
                />

                <SingleSelectDropdown
                    label="Format de date"
                    options={[
                        {
                            id: "1",
                            label: "DD/MM/YYYY",
                            value: "DD/MM/YYYY"
                        },
                        {
                            id: "2",
                            label: "MM/DD/YYYY",
                            value: "MM/DD/YYYY"
                        }
                    ]}
                    onChange={() => { }}
                />
                
            </div>


        </CardContent>
    )
}
