import { createContext, useContext, useState, type ReactNode } from 'react';

export type Persona = 'reinsurer' | 'broker' | 'provider';

interface PersonaContextType {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

const PersonaContext = createContext<PersonaContextType>({ persona: 'provider', setPersona: () => {} });

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>('provider');
  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
