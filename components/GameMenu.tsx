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
            <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col glass-panel border-white/10 bg-slate-900/95 text-slate-100">
                <DialogHeader>
                    <DialogTitle className="text-slate-100">Game Menu</DialogTitle>
                    <DialogDescription className="text-xs text-slate-400">
                        Adjust settings or return to the main station.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 overflow-y-auto hide-scrollbar pr-2">
                    <Button
                        onClick={onShowReport}
                        variant="ghost-dark"
                        className="flex items-center justify-start gap-4 h-16 shrink-0 group border border-white/10 rounded-xl"
                    >
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="font-semibold text-base">Career Profile</span>
                            <span className="text-xs text-slate-400 group-hover:text-amber-200/80">View your strategic analysis</span>
                        </div>
                    </Button>

                    {onShowConstellation && (
                        <Button
                            onClick={onShowConstellation}
                            variant="ghost-dark"
                            className="flex items-center justify-start gap-4 h-16 shrink-0 group border border-white/10 rounded-xl"
                        >
                            <Stars className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="font-semibold text-base">Connections</span>
                                <span className="text-xs text-slate-400 group-hover:text-indigo-200/80">View your network & skills</span>
                            </div>
                        </Button>
                    )}

                    {playerId && (
                        <Link href={`/admin/${playerId}`} passHref>
                            <Button
                                variant="ghost-dark"
                                className="flex items-center justify-start gap-4 h-16 w-full mb-4 shrink-0 group border border-white/10 rounded-xl"
                            >
                                <Brain className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="font-semibold text-base">Clinical Audit</span>
                                    <span className="text-xs text-slate-400 group-hover:text-emerald-200/80">MIVA 2.0 Self-Reflection</span>
                                </div>
                            </Button>
                        </Link>
                    )}

                    {onToggleMute && (
                        <Button
                            onClick={onToggleMute}
                            variant="ghost-dark"
                            className="flex items-center justify-start gap-4 h-16 shrink-0 group border border-white/10 rounded-xl"
                        >
                            {isMuted ? (
                                <VolumeX className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                            ) : (
                                <Volume2 className="w-5 h-5 text-slate-400 group-hover:text-slate-300" />
                            )}
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="font-semibold text-base">{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                                <span className="text-xs text-slate-400 group-hover:text-slate-300">Toggle sound effects</span>
                            </div>
                        </Button>
                    )}

                    {/* Return to Station Removed for Simplicity (Jobsian Focus) */}
                </div>
            </DialogContent>
        </Dialog>
    )
}
