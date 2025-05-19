// components/OutputPreview.test.tsx
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import OutputPreview from './OutputPreview'

const arquivos = [
  { path: 'a.txt', content: 'A' },
  { path: 'b.txt', content: 'B' },
]

test('renderiza detalhes para cada arquivo e expande ao clicar', () => {
  render(<OutputPreview arquivos={arquivos} />)

  // Busca os summaries pelo texto do caminho
  const summaries = screen.getAllByText(/a\.txt|b\.txt/)
  expect(summaries).toHaveLength(2)

  // Ao clicar no segundo summary, o conteúdo 'B' deve aparecer
  fireEvent.click(summaries[1])
  expect(screen.getByText('B')).toBeInTheDocument()
})
