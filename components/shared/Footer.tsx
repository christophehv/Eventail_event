
import Link from "next/link"

// Composant Footer pour le bas de page.
const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href='/'>
          <h1 className="font-weight: 900">EVENTAIL</h1>
        </Link>

        <p>2024 EVENTAIL.</p>
      </div>
    </footer>
  )
}

export default Footer