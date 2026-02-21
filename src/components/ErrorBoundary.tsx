import React from 'react'

interface Props {
    children: React.ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: React.ErrorInfo | null
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo)
        this.setState({ errorInfo })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    backgroundColor: '#fff',
                    fontFamily: 'sans-serif',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#e11d48', marginBottom: '12px' }}>Ilovada xatolik yuz berdi</h2>
                    <p style={{ color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                        {this.state.error?.message || 'Noma\'lum xatolik'}
                    </p>
                    {this.state.error?.stack && (
                        <pre style={{
                            background: '#f1f5f9',
                            padding: '12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            overflowX: 'auto',
                            maxWidth: '100%',
                            textAlign: 'left',
                            color: '#64748b',
                            marginBottom: '16px',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all'
                        }}>
                            {this.state.error.stack.substring(0, 500)}
                        </pre>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: '#e11d48',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Qayta yuklash
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}
