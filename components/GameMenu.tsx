import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import { Settings, FileText, Volume2, VolumeX, Brain, Stars } from 'lucide-react'

interface GameMenuProps {
    onShowReport: () => void
    onReturnToStation?: () => void
    onShowConstellation?: () => void
    isMuted?: boolean
    onToggleMute?: () => void
    playerId?: string
}

export function GameMenu({ onShowReport, onReturnToStation: _onReturnToStation, onShowConstellation, isMuted = false, onToggleMute, playerId }: GameMenuProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                    <Settings className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Game Menu</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500">
                        Adjust settings or return to the main station.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Button
                        onClick={onShowReport}
                        variant="outline"
                        className="flex items-center justify-start gap-4 h-14"
                    >
                        <FileText className="w-5 h-5 text-slate-500" />
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-slate-900">Career Profile</span>
                            <span className="text-xs text-slate-500">View your strategic analysis</span>
                        </div>
                    </Button>

                    {onShowConstellation && (
                        <Button
                            onClick={onShowConstellation}
                            variant="outline"
                            className="flex items-center justify-start gap-4 h-14"
                        >
                            <Stars className="w-5 h-5 text-indigo-500" />
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-900">Connections</span>
                                <span className="text-xs text-slate-500">View your network & skills</span>
                            </div>
                        </Button>
                    )}

                    {playerId && (
                        <Link href={`/admin/${playerId}`} passHref>
                            <Button
                                variant="outline"
                                className="flex items-center justify-start gap-4 h-14 w-full mb-4"
                            >
                                <Brain className="w-5 h-5 text-indigo-500" />
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-slate-900">Clinical Audit</span>
                                    <span className="text-xs text-slate-500">MIVA 2.0 Self-Reflection</span>
                                </div>
                            </Button>
                        </Link>
                    )}

                    {onToggleMute && (
                        <Button
                            onClick={onToggleMute}
                            variant="outline"
                            className="flex items-center justify-start gap-4 h-14"
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5 text-slate-500" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-slate-500" />
                            )}
                            <div className="flex flex-col items-start">
                                <span className="font-semibold text-slate-900">{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                                <span className="text-xs text-slate-500">Toggle sound effects</span>
                            </div>
                        </Button>
                    )}

                    {/* Return to Station Removed for Simplicity (Jobsian Focus) */}
                </div>
            </DialogContent>
        </Dialog>
    )
}
