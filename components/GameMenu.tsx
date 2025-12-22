import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from '@/components/ui/dialog'
import { Settings, FileText, Home, Volume2, VolumeX } from 'lucide-react'

interface GameMenuProps {
    onShowReport: () => void
    onReturnToStation?: () => void
    isMuted?: boolean
    onToggleMute?: () => void
}

export function GameMenu({ onShowReport, onReturnToStation, isMuted = false, onToggleMute }: GameMenuProps) {
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
