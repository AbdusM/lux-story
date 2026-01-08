import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/5">
                    <Settings className="w-5 h-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={onShowReport}>
                    <FileText className="w-4 h-4 mr-3 text-amber-500/80" />
                    <span>Career Profile</span>
                </DropdownMenuItem>

                {playerId && (
                    <DropdownMenuItem asChild>
                        <Link href={`/admin/${playerId}`} className="flex items-center">
                            <Brain className="w-4 h-4 mr-3 text-emerald-500/80" />
                            <span>Clinical Audit</span>
                        </Link>
                    </DropdownMenuItem>
                )}

                {onToggleMute && (
                    <DropdownMenuItem onClick={onToggleMute}>
                        {isMuted ? (
                            <VolumeX className="w-4 h-4 mr-3 text-red-400/80" />
                        ) : (
                            <Volume2 className="w-4 h-4 mr-3 text-slate-400" />
                        )}
                        <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
