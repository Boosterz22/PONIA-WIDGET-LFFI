import React, { useState, useRef, useEffect } from 'react'
import { X, Plus, FileText, Camera, ChevronDown, ChevronUp, Loader, Upload, Scan } from 'lucide-react'
import { supabase } from '../services/supabase'

const CATEGORIES = {
  boulangerie: ['Pains', 'Viennoiseries', 'Pâtisseries', 'Matières premières', 'Emballages'],
  restaurant: ['Viandes', 'Poissons', 'Légumes', 'Fruits', 'Produits laitiers', 'Épices', 'Boissons', 'Desserts'],
  bar: ['Alcools', 'Bières', 'Vins', 'Softs', 'Sirops', 'Snacks', 'Café/Thé'],
  cave: ['Vins rouges', 'Vins blancs', 'Vins rosés', 'Champagnes', 'Spiritueux', 'Accessoires'],
  fromagerie: ['Fromages frais', 'Fromages affinés', 'Charcuterie', 'Accompagnements'],
  default: ['Alimentaire', 'Boissons', 'Emballages', 'Hygiène', 'Équipements', 'Autre']
}

export default function AddProductModal({ onClose, onSave, onSaveMultiple }) {
  const [activeTab, setActiveTab] = useState('manual')
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    currentQuantity: '',
    unit: 'kg',
    alertThreshold: '',
    supplier: '',
    expiryDate: '',
    barcode: ''
  })
  const [loading, setLoading] = useState(false)
  const [showCategories, setShowCategories] = useState(false)
  const [importedProducts, setImportedProducts] = useState([])
  const [analyzing, setAnalyzing] = useState(false)
  const [scannerActive, setScannerActive] = useState(false)
  const [scannedCode, setScannedCode] = useState('')
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  
  const businessType = localStorage.getItem('ponia_business_type') || 'default'
  const categories = CATEGORIES[businessType] || CATEGORIES.default

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setAnalyzing(true)
    
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Veuillez vous reconnecter')
        return
      }

      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          image: base64,
          mimeType: file.type,
          businessType
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.products && data.products.length > 0) {
          setImportedProducts(data.products.map(p => ({ ...p, selected: true })))
        } else {
          alert('Aucun produit détecté dans ce document. Essayez avec une image plus claire.')
        }
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.message || 'Impossible d\'analyser le document'}`)
      }
    } catch (error) {
      console.error('Erreur analyse document:', error)
      alert('Erreur lors de l\'analyse du document')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleImportProducts = async () => {
    const selectedProducts = importedProducts.filter(p => p.selected)
    if (selectedProducts.length === 0) {
      alert('Sélectionnez au moins un produit')
      return
    }

    setLoading(true)
    try {
      if (onSaveMultiple) {
        await onSaveMultiple(selectedProducts)
      } else {
        for (const product of selectedProducts) {
          await onSave(product)
        }
      }
      setImportedProducts([])
      onClose()
    } catch (error) {
      console.error('Erreur import produits:', error)
      alert('Erreur lors de l\'import des produits')
    } finally {
      setLoading(false)
    }
  }

  const toggleProductSelection = (index) => {
    setImportedProducts(prev => prev.map((p, i) => 
      i === index ? { ...p, selected: !p.selected } : p
    ))
  }

  const startScanner = async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      
      setScannerActive(true)
      
      setTimeout(async () => {
        const scanner = new Html5Qrcode('scanner-container')
        scannerRef.current = scanner
        
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 }
          },
          (decodedText) => {
            setScannedCode(decodedText)
            setFormData(prev => ({ ...prev, barcode: decodedText }))
            scanner.stop().catch(() => {})
            setScannerActive(false)
            lookupBarcode(decodedText)
          },
          () => {}
        )
      }, 100)
    } catch (error) {
      console.error('Erreur scanner:', error)
      alert('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
      setScannerActive(false)
    }
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {})
    }
    setScannerActive(false)
  }

  const lookupBarcode = async (code) => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/barcode-lookup/${code}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.product) {
          setFormData(prev => ({
            ...prev,
            name: data.product.name || prev.name,
            category: data.product.category || prev.category,
            unit: data.product.unit || prev.unit,
            barcode: code
          }))
          setActiveTab('manual')
        } else {
          setActiveTab('manual')
          alert('Produit non trouvé dans la base. Complétez les informations manuellement.')
        }
      }
    } catch (error) {
      console.error('Erreur lookup barcode:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManualBarcode = (e) => {
    const code = e.target.value
    setFormData(prev => ({ ...prev, barcode: code }))
    if (code.length >= 8) {
      lookupBarcode(code)
    }
  }

  const tabs = [
    { id: 'manual', label: 'Manuel', icon: Plus },
    { id: 'document', label: 'Document', icon: FileText },
    { id: 'barcode', label: 'Code-barres', icon: Scan }
  ]

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{ 
        background: 'white',
        borderRadius: '16px',
        maxWidth: '550px', 
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E5E7EB'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Ajouter des produits</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: '#6B7280', 
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid #E5E7EB',
          padding: '0 1rem'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #000' : '2px solid transparent',
                color: activeTab === tab.id ? '#000' : '#6B7280',
                fontWeight: activeTab === tab.id ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <tab.icon size={18} />
              <span style={{ fontSize: '0.875rem' }}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: '1.5rem' }}>
          
          {/* Tab: Manuel */}
          {activeTab === 'manual' && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Ex: Farine T55"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem'
                  }}
                />
              </div>

              {/* Catégorie pliable */}
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCategories(!showCategories)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    color: '#374151'
                  }}
                >
                  <span>
                    {formData.category ? `${formData.category}${formData.subcategory ? ` > ${formData.subcategory}` : ''}` : 'Catégorie (optionnel)'}
                  </span>
                  {showCategories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                {showCategories && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.75rem',
                    background: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: '#6B7280' }}>
                        Catégorie
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="">Sélectionner...</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem', color: '#6B7280' }}>
                        Sous-catégorie
                      </label>
                      <input
                        type="text"
                        name="subcategory"
                        placeholder="Ex: Bio, Premium..."
                        value={formData.subcategory}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    Quantité *
                  </label>
                  <input
                    type="number"
                    name="currentQuantity"
                    placeholder="25"
                    value={formData.currentQuantity}
                    onChange={handleChange}
                    step="0.01"
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    Unité *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem'
                    }}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="cl">cl</option>
                    <option value="pièces">pièces</option>
                    <option value="bouteilles">bouteilles</option>
                    <option value="sachets">sachets</option>
                    <option value="boîtes">boîtes</option>
                    <option value="cartons">cartons</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                  Seuil d'alerte *
                </label>
                <input
                  type="number"
                  name="alertThreshold"
                  placeholder="10"
                  value={formData.alertThreshold}
                  onChange={handleChange}
                  step="0.01"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem'
                  }}
                />
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                  Alerte quand le stock descend sous ce seuil
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    Fournisseur
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    placeholder="Optionnel"
                    value={formData.supplier}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                    DLC/DLUO
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '0.9375rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  onClick={onClose} 
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: '#F3F4F6',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: '#000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Ajout...' : 'Ajouter'}
                </button>
              </div>
            </form>
          )}

          {/* Tab: Document */}
          {activeTab === 'document' && (
            <div>
              {importedProducts.length === 0 ? (
                <div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #D1D5DB',
                      borderRadius: '12px',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {analyzing ? (
                      <div>
                        <Loader size={48} style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                        <p style={{ color: '#374151', fontWeight: '500' }}>Analyse IA en cours...</p>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Extraction des produits</p>
                      </div>
                    ) : (
                      <div>
                        <Upload size={48} style={{ margin: '0 auto 1rem', color: '#9CA3AF' }} />
                        <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.5rem' }}>
                          Glissez ou cliquez pour importer
                        </p>
                        <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                          Photo de facture, bon de livraison, liste de stock...
                        </p>
                        <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                          JPG, PNG, PDF (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                  
                  <div style={{ 
                    marginTop: '1.5rem', 
                    padding: '1rem', 
                    background: '#FEF3C7', 
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#92400E'
                  }}>
                    <strong>Astuce :</strong> L'IA analyse automatiquement les noms de produits, quantités et unités. 
                    Plus l'image est nette, meilleurs seront les résultats.
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ marginBottom: '1rem', fontWeight: '500' }}>
                    {importedProducts.length} produit(s) détecté(s) :
                  </p>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {importedProducts.map((product, idx) => (
                      <div 
                        key={idx}
                        onClick={() => toggleProductSelection(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.75rem',
                          background: product.selected ? '#F0FDF4' : '#F9FAFB',
                          border: product.selected ? '1px solid #22C55E' : '1px solid #E5E7EB',
                          borderRadius: '8px',
                          marginBottom: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        <input 
                          type="checkbox" 
                          checked={product.selected}
                          onChange={() => {}}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: '500', margin: 0 }}>{product.name}</p>
                          <p style={{ fontSize: '0.8125rem', color: '#6B7280', margin: 0 }}>
                            {product.currentQuantity} {product.unit}
                            {product.category && ` · ${product.category}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => setImportedProducts([])}
                      style={{
                        flex: 1,
                        padding: '0.875rem',
                        background: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      Annuler
                    </button>
                    <button 
                      onClick={handleImportProducts}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '0.875rem',
                        background: '#000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Import...' : `Importer (${importedProducts.filter(p => p.selected).length})`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Code-barres */}
          {activeTab === 'barcode' && (
            <div>
              {!scannerActive ? (
                <div>
                  <button
                    onClick={startScanner}
                    style={{
                      width: '100%',
                      padding: '2rem',
                      background: '#F9FAFB',
                      border: '2px dashed #D1D5DB',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      marginBottom: '1.5rem'
                    }}
                  >
                    <Camera size={48} style={{ margin: '0 auto 1rem', display: 'block', color: '#6B7280' }} />
                    <p style={{ fontWeight: '500', margin: 0 }}>Activer la caméra</p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                      Scannez un code-barres produit
                    </p>
                  </button>

                  <div style={{ textAlign: 'center', color: '#6B7280', marginBottom: '1rem' }}>ou</div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                      Saisir manuellement
                    </label>
                    <input
                      type="text"
                      placeholder="Code-barres (EAN-13, UPC...)"
                      value={formData.barcode}
                      onChange={handleManualBarcode}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '8px',
                        fontSize: '0.9375rem'
                      }}
                    />
                  </div>

                  {scannedCode && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      background: '#F0FDF4', 
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}>
                      Code scanné : <strong>{scannedCode}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div 
                    id="scanner-container" 
                    style={{ 
                      width: '100%', 
                      height: '250px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      marginBottom: '1rem'
                    }}
                  />
                  <button
                    onClick={stopScanner}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Arrêter le scan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
