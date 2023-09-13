const getEnv = (key: string): any => {
  return import.meta.env[key] as any
}

export { getEnv }
