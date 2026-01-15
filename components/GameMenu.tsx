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
    volume?: number
    onVolumeChange?: (volume: number) => void
    playerId?: string
}

export function GameMenu({ onShowReport, onReturnToStation: _onReturnToStation, onShowConstellation: _onShowConstellation, isMuted = false, onToggleMute, volume = 50, onVolumeChange, playerId }: GameMenuProps) {
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

                {onVolumeChange && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-3 space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                                <span>Volume</span>
                                <span className="text-amber-400 font-medium">{volume}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={volume}
                                onChange={(e) => onVolumeChange(parseInt(e.target.value, 10))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                style={{
                                    background: `linear-gradient(to right, rgb(245 158 11) 0%, rgb(245 158 11) ${volume}%, rgb(51 65 85) ${volume}%, rgb(51 65 85) 100%)`
                                }}
                            />
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
