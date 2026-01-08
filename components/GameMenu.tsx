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
import { Settings, FileText, Volume2, VolumeX, Brain } from 'lucide-react'

interface GameMenuProps {
    onShowReport?: () => void
    onReturnToStation?: () => void
    onShowConstellation?: () => void
    isMuted?: boolean
    onToggleMute?: () => void
    playerId?: string
}

export function GameMenu({ onShowReport, onReturnToStation: _onReturnToStation, onShowConstellation: _onShowConstellation, isMuted = false, onToggleMute, playerId }: GameMenuProps) {
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
                <div className="flex flex-col gap-1 py-4 pr-1">
                    <Button
                        onClick={onShowReport}
                        variant="ghost"
                        className="w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white"
                    >
                        <FileText className="w-4 h-4 text-amber-500/80" />
                        <span className="text-sm font-medium">Career Profile</span>
                    </Button>

                    {playerId && (
                        <Link href={`/admin/${playerId}`} passHref legacyBehavior>
                            <Button
                                asChild
                                variant="ghost"
                                className="w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white"
                            >
                                <a>
                                    <Brain className="w-4 h-4 text-emerald-500/80" />
                                    <span className="text-sm font-medium">Clinical Audit</span>
                                </a>
                            </Button>
                        </Link>
                    )}

                    {onToggleMute && (
                        <Button
                            onClick={onToggleMute}
                            variant="ghost"
                            className="w-full flex items-center justify-start gap-3 h-12 px-4 rounded-lg hover:bg-white/5 transition-all text-slate-300 hover:text-white"
                        >
                            {isMuted ? (
                                <VolumeX className="w-4 h-4 text-red-400/80" />
                            ) : (
                                <Volume2 className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="text-sm font-medium">{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
