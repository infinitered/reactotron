import React, { useState, useCallback, useEffect } from "react"
import styled from "styled-components"
import { Modal } from "reactotron-core-ui"
import { DEFAULT_SERVER_CONFIG, type McpRedactionServerConfig } from "reactotron-mcp"

const Section = styled.div`
  margin-top: 16px;
`

const SectionTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${(props) => props.theme.foreground};
`

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: ${(props) => props.theme.foregroundDark};
  margin-bottom: 4px;
`

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
  padding: 4px;
  border: 1px solid ${(props) => props.theme.chromeLine};
  border-radius: 4px;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
`

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-family: monospace;
  background-color: ${(props) => props.theme.backgroundHighlight};
  color: ${(props) => props.theme.foreground};
`

const TagRemove = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  &:hover {
    color: ${(props) => props.theme.foreground};
  }
`

const AddInput = styled.input`
  border: 1px solid ${(props) => props.theme.chromeLine};
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  color: ${(props) => props.theme.foreground};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: monospace;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  &::placeholder {
    color: ${(props) => props.theme.foregroundDark};
    opacity: 0.6;
  }
`

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${(props) => props.theme.foreground};
  cursor: pointer;
  margin-bottom: 8px;
`

const Description = styled.span`
  color: ${(props) => props.theme.foregroundDark};
  font-size: 11px;
`

const ResetButton = styled.button`
  display: block;
  margin-left: auto;
  margin-top: -28px;
  background: none;
  border: 1px solid ${(props) => props.theme.chromeLine};
  border-radius: 4px;
  color: ${(props) => props.theme.foreground};
  font-size: 12px;
  padding: 4px 10px;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
    border-color: ${(props) => props.theme.foreground};
  }
`

interface TagListEditorProps {
  label: string
  placeholder: string
  values: string[]
  onChange: (values: string[]) => void
}

function TagListEditor({ label, placeholder, values, onChange }: TagListEditorProps) {
  const [inputValue, setInputValue] = useState("")

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault()
      const newVal = inputValue.trim()
      if (!values.includes(newVal)) {
        onChange([...values, newVal])
      }
      setInputValue("")
    }
  }, [inputValue, values, onChange])

  const removeTag = useCallback((index: number) => {
    onChange(values.filter((_, i) => i !== index))
  }, [values, onChange])

  return (
    <div>
      <Label>{label}</Label>
      {values.length > 0 && (
        <TagContainer>
          {values.map((v, i) => (
            <Tag key={i}>
              {v}
              <TagRemove onClick={() => removeTag(i)}>&times;</TagRemove>
            </Tag>
          ))}
        </TagContainer>
      )}
      <AddInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  )
}

interface Props {
  isOpen: boolean
  onClose: () => void
  config: McpRedactionServerConfig
  onUpdate: (config: Partial<McpRedactionServerConfig>) => void
}

export default function McpSettingsModal({ isOpen, onClose, config, onUpdate }: Props) {
  const [localConfig, setLocalConfig] = useState(config)

  useEffect(() => {
    if (isOpen) setLocalConfig(config)
  }, [isOpen, config])

  const updateDefaults = useCallback((patch: Partial<McpRedactionServerConfig["defaults"]>) => {
    const next = { ...localConfig, defaults: { ...localConfig.defaults, ...patch } }
    setLocalConfig(next)
    onUpdate(next)
  }, [localConfig, onUpdate])

  const updatePermission = useCallback((key: "allowClientDisable" | "allowClientRemoveRules", value: boolean) => {
    const next = { ...localConfig, [key]: value }
    setLocalConfig(next)
    onUpdate(next)
  }, [localConfig, onUpdate])

  const resetToDefaults = useCallback(() => {
    setLocalConfig(DEFAULT_SERVER_CONFIG)
    onUpdate(DEFAULT_SERVER_CONFIG)
  }, [onUpdate])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="MCP Redaction Settings">
      <ResetButton onClick={resetToDefaults}>Reset to defaults</ResetButton>
      <Section>
        <SectionTitle>Redacted Header Names</SectionTitle>
        <Description>HTTP header names redacted in MCP responses (case-insensitive)</Description>
        <TagListEditor
          label=""
          placeholder="Type header name and press Enter"
          values={localConfig.defaults.headerNames ?? []}
          onChange={(v) => updateDefaults({ headerNames: v })}
        />
      </Section>

      <Section>
        <SectionTitle>Sensitive Key Names</SectionTitle>
        <Description>Object keys redacted wherever found in payloads (case-insensitive)</Description>
        <TagListEditor
          label=""
          placeholder="Type key name and press Enter"
          values={localConfig.defaults.sensitiveKeys ?? []}
          onChange={(v) => updateDefaults({ sensitiveKeys: v })}
        />
      </Section>

      <Section>
        <SectionTitle>State Path Patterns</SectionTitle>
        <Description>Dot-separated paths to redact in state (supports trailing wildcard, e.g. auth.tokens.*)</Description>
        <TagListEditor
          label=""
          placeholder="Type state path and press Enter"
          values={localConfig.defaults.statePathPatterns ?? []}
          onChange={(v) => updateDefaults({ statePathPatterns: v })}
        />
      </Section>

      <Section>
        <SectionTitle>Value Patterns</SectionTitle>
        <Description>Regex patterns matched against string values</Description>
        <TagListEditor
          label=""
          placeholder="Type regex pattern and press Enter"
          values={localConfig.defaults.valuePatterns ?? []}
          onChange={(v) => updateDefaults({ valuePatterns: v })}
        />
      </Section>

      <Section>
        <SectionTitle>Client Permissions</SectionTitle>
        <CheckboxRow>
          <input
            type="checkbox"
            checked={localConfig.allowClientDisable}
            onChange={(e) => updatePermission("allowClientDisable", e.target.checked)}
          />
          Allow apps to disable redaction entirely
        </CheckboxRow>
        <CheckboxRow>
          <input
            type="checkbox"
            checked={localConfig.allowClientRemoveRules}
            onChange={(e) => updatePermission("allowClientRemoveRules", e.target.checked)}
          />
          Allow apps to remove default rules
        </CheckboxRow>
      </Section>
    </Modal>
  )
}
