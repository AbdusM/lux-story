/**
 * Narrative Runtime Policy
 *
 * Explicit policy switches for narrative systems that can otherwise drift
 * between "implemented" and "silently disabled".
 */

export type PatternVoicePolicy = 'off' | 'minimal' | 'on'
export type IcebergActivationPolicy = 'required' | 'optional' | 'defer'

export const NARRATIVE_RUNTIME_POLICY: {
  patternVoicePolicy: PatternVoicePolicy
  icebergActivation: IcebergActivationPolicy
} = {
  // `minimal` keeps pattern voices active but lightweight.
  patternVoicePolicy: 'minimal',
  // `required` means iceberg tags are expected in active narrative content.
  icebergActivation: 'required',
}

