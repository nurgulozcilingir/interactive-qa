import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '@/hooks/useSocket'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'

interface TreeData {
  id: string
  text: string
  position?: {
    x: number
    y: number
    branch: string
  }
  submittedAt: string
}

interface Leaf {
  x: number
  y: number
  angle: number
  size: number
  color: string
  opacity: number
  isNew?: boolean
  animationStartTime?: number
  data?: TreeData
}

interface Branch {
  x1: number
  y1: number
  x2: number
  y2: number
  thickness: number
  depth: number
}

export default function TreeDisplayPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  const [treeData, setTreeData] = useState<TreeData[]>([])
  const [session, setSession] = useState<any>(null)
  const [hoveredLeaf, setHoveredLeaf] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [leaves, setLeaves] = useState<Leaf[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [animationFrame, setAnimationFrame] = useState(0)
  const [newLeafQueue, setNewLeafQueue] = useState<TreeData[]>([])
  const { on, emit } = useSocket({ autoConnect: true })

  // Generate organic tree structure
  useEffect(() => {
    const generateBranches = () => {
      const centerX = 400
      const trunkBase = 550
      const trunkTop = 350
      const newBranches: Branch[] = []

      // Main trunk segments for organic feel
      for (let i = 0; i < 8; i++) {
        const y1 = trunkBase - (i * 25)
        const y2 = trunkBase - ((i + 1) * 25)
        const curve = Math.sin(i * 0.3) * 3
        
        newBranches.push({
          x1: centerX + curve,
          y1: y1,
          x2: centerX + curve + Math.sin(i * 0.5) * 2,
          y2: y2,
          thickness: 25 - (i * 2),
          depth: 0
        })
      }

      // Primary branches
      const primaryBranches = [
        { angle: -Math.PI * 0.75, length: 120, startHeight: 80 },
        { angle: -Math.PI * 0.25, length: 110, startHeight: 100 },
        { angle: -Math.PI * 0.6, length: 100, startHeight: 120 },
        { angle: -Math.PI * 0.4, length: 95, startHeight: 140 },
        { angle: -Math.PI * 0.8, length: 85, startHeight: 160 },
        { angle: -Math.PI * 0.2, length: 90, startHeight: 180 },
      ]

      primaryBranches.forEach((branch, index) => {
        const startX = centerX + Math.sin(index * 0.5) * 8
        const startY = trunkBase - branch.startHeight
        const endX = startX + Math.cos(branch.angle) * branch.length
        const endY = startY + Math.sin(branch.angle) * branch.length

        newBranches.push({
          x1: startX,
          y1: startY,
          x2: endX,
          y2: endY,
          thickness: 12 - index,
          depth: 1
        })

        // Secondary branches
        for (let i = 0; i < 2; i++) {
          const subAngle = branch.angle + (i === 0 ? -0.3 : 0.3)
          const subLength = branch.length * 0.6
          const subEndX = endX + Math.cos(subAngle) * subLength
          const subEndY = endY + Math.sin(subAngle) * subLength

          newBranches.push({
            x1: endX,
            y1: endY,
            x2: subEndX,
            y2: subEndY,
            thickness: 6 - i,
            depth: 2
          })
        }
      })

      setBranches(newBranches)
    }

    generateBranches()
  }, [])

  // Create professional leaf placement
  const createLeafPosition = (index: number, total: number = leaves.length + 1) => {
    // Get branches where leaves can grow (secondary branches)
    const leafBranches = branches.filter(b => b.depth === 2)
    if (leafBranches.length === 0) return { x: 400, y: 300, angle: 0 }

    const branch = leafBranches[index % leafBranches.length]
    
    // Place leaves near branch ends with some natural variation
    const t = 0.7 + Math.random() * 0.3 // Position along branch
    const x = branch.x1 + (branch.x2 - branch.x1) * t + (Math.random() - 0.5) * 20
    const y = branch.y1 + (branch.y2 - branch.y1) * t + (Math.random() - 0.5) * 20
    const angle = Math.atan2(branch.y2 - branch.y1, branch.x2 - branch.x1) + (Math.random() - 0.5) * 0.5

    return { x, y, angle }
  }

  // Add new leaf with animation
  const addNewLeaf = useCallback((newAnswerData: TreeData) => {
    if (branches.length === 0) return

    const professionalColors = [
      '#2d5a27', '#3d6b30', '#4a7c3a', '#5a8f4a', 
      '#6ba05a', '#7cb06a', '#8bc17a', '#9ad28a'
    ]
    
    // Use position from backend if available, otherwise calculate
    const position = newAnswerData.position ? {
      x: 400 + newAnswerData.position.x, // Center + offset
      y: 350 + newAnswerData.position.y, // Tree center + offset
      angle: (newAnswerData.position.angle || 0) * Math.PI / 180
    } : createLeafPosition(leaves.length)
    
    const newLeaf: Leaf = {
      x: position.x,
      y: position.y,
      angle: position.angle,
      size: 12 + Math.random() * 8,
      color: professionalColors[leaves.length % professionalColors.length],
      opacity: 0,
      isNew: true,
      animationStartTime: Date.now(),
      data: newAnswerData
    }

    console.log('Adding new leaf:', newLeaf)
    setLeaves(prev => [...prev, newLeaf])
    setTreeData(prev => [...prev, newAnswerData])
  }, [branches, leaves.length])

  // Generate professional leaves
  useEffect(() => {
    if (branches.length === 0) return

    // Professional color palette - muted, sophisticated
    const professionalColors = [
      '#2d5a27', // Deep forest green
      '#3d6b30', // Forest green
      '#4a7c3a', // Medium green
      '#5a8f4a', // Fresh green  
      '#6ba05a', // Light green
      '#7cb06a', // Sage green
      '#8bc17a', // Pale green
      '#9ad28a', // Light sage
    ]

    const newLeaves: Leaf[] = treeData.map((item, index) => {
      const position = createLeafPosition(index, treeData.length)
      
      return {
        x: position.x,
        y: position.y,
        angle: position.angle,
        size: 12 + Math.random() * 8, // Consistent, moderate sizing
        color: professionalColors[index % professionalColors.length],
        opacity: 0.8 + Math.random() * 0.2,
        data: item
      }
    })
    
    setLeaves(newLeaves)
  }, [treeData, branches])

  // Load session data and setup socket listeners
  useEffect(() => {
    if (!sessionId) return

    const loadData = async () => {
      try {
        const [sessionRes, treeRes] = await Promise.all([
          fetch(`/api/sessions/${sessionId}`),
          fetch(`/api/sessions/${sessionId}/tree`)
        ])

        if (sessionRes.ok) {
          const sessionData = await sessionRes.json()
          setSession(sessionData.data)
        }

        if (treeRes.ok) {
          const treeDataRes = await treeRes.json()
          setTreeData(treeDataRes.data)
        }
      } catch (error) {
        toast.error('Veri yüklenirken hata oluştu')
      }
    }

    loadData()

    // Join the session room for real-time updates
    emit('participant:join', { sessionId })

    // Socket listeners for real-time updates
    const cleanupFunctions = [
      on('answer:new', (data: TreeData) => {
        console.log('New answer received:', data)
        addNewLeaf(data)
        toast('✨ Yeni cevap eklendi!', { 
          duration: 2000,
          style: { background: '#22c55e', color: 'white' }
        })
      }),

      on('tree:update', (data: any) => {
        console.log('Tree update:', data)
        // Additional tree update handling if needed
      }),

      on('session:ended', () => {
        toast('Oturum sona erdi', { icon: '📊' })
        setSession(prev => prev ? { ...prev, isActive: false } : null)
      }),

      on('participant:count', (count: number) => {
        console.log('Participant count:', count)
      }),

      on('error', (error: any) => {
        console.error('Socket error:', error)
        toast.error(error.message || 'Bağlantı hatası')
      })
    ]

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup())
    }
  }, [sessionId, on, emit, addNewLeaf])

  // Subtle animation for breathing effect
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1)
      requestAnimationFrame(animate)
    }
    const frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Draw professional tree
  const drawProfessionalTree = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const time = animationFrame * 0.005 // Very subtle animation
    
    // Clean, gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    bgGradient.addColorStop(0, '#f8fafc')   // Light gray-blue
    bgGradient.addColorStop(0.7, '#f1f5f9') // Slightly darker
    bgGradient.addColorStop(1, '#e2e8f0')   // Base gray
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Subtle ground area
    const groundGradient = ctx.createLinearGradient(0, 520, 0, 600)
    groundGradient.addColorStop(0, 'rgba(34, 139, 34, 0.1)')
    groundGradient.addColorStop(1, 'rgba(34, 139, 34, 0.2)')
    ctx.fillStyle = groundGradient
    ctx.fillRect(0, 520, canvas.width, 80)

    // Draw branches with professional styling
    branches.forEach((branch, index) => {
      const breathe = Math.sin(time + index * 0.1) * 0.5 // Very subtle movement
      
      ctx.strokeStyle = branch.depth === 0 ? '#654321' : '#8B4513'
      ctx.lineWidth = branch.thickness + breathe * 0.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Add subtle shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
      ctx.shadowBlur = 2
      ctx.shadowOffsetX = 1
      ctx.shadowOffsetY = 1
      
      ctx.beginPath()
      ctx.moveTo(branch.x1, branch.y1)
      
      if (branch.depth === 0) {
        // Straight trunk with minimal curve
        ctx.lineTo(branch.x2, branch.y2)
      } else {
        // Gentle curves for branches
        const midX = (branch.x1 + branch.x2) / 2
        const midY = (branch.y1 + branch.y2) / 2 + breathe
        ctx.quadraticCurveTo(midX, midY, branch.x2, branch.y2)
      }
      
      ctx.stroke()
      
      // Reset shadow
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
    })

    // Draw professional leaves with entrance animation
    leaves.forEach((leaf, index) => {
      const breathe = Math.sin(time * 2 + index * 0.2) * 1 // Gentle sway
      let currentOpacity = leaf.opacity + (hoveredLeaf === leaf.data?.id ? 0.2 : 0)
      let currentSize = leaf.size
      let leafY = leaf.y
      
      // Handle entrance animation for new leaves
      if (leaf.isNew && leaf.animationStartTime) {
        const animationDuration = 1500 // 1.5 seconds
        const elapsed = Date.now() - leaf.animationStartTime
        const progress = Math.min(elapsed / animationDuration, 1)
        
        if (progress < 1) {
          // Easing function for smooth animation
          const easeOutBounce = (t: number) => {
            if (t < 1 / 2.75) {
              return 7.5625 * t * t
            } else if (t < 2 / 2.75) {
              return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75
            } else if (t < 2.5 / 2.75) {
              return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375
            } else {
              return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375
            }
          }
          
          const easedProgress = easeOutBounce(progress)
          currentOpacity = easedProgress * 0.9
          currentSize = leaf.size * easedProgress
          leafY = leaf.y + (1 - easedProgress) * 30 // Drop from above
        } else {
          // Animation complete, remove isNew flag
          leaf.isNew = false
          leaf.animationStartTime = undefined
          currentOpacity = 0.9
        }
      } else if (!leaf.isNew) {
        currentOpacity = 0.9
      }
      
      ctx.save()
      ctx.translate(leaf.x, leafY + breathe)
      ctx.rotate(leaf.angle + breathe * 0.01)
      
      // Leaf shadow for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.globalAlpha = currentOpacity * 0.5
      ctx.beginPath()
      ctx.ellipse(1, 1, currentSize * 0.9, currentSize * 1.3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Main leaf shape - professional oval
      ctx.fillStyle = leaf.color
      ctx.globalAlpha = currentOpacity
      ctx.beginPath()
      ctx.ellipse(0, 0, currentSize * 0.8, currentSize * 1.2, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Simple vein for detail
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.globalAlpha = currentOpacity
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(0, -currentSize)
      ctx.lineTo(0, currentSize)
      ctx.stroke()
      
      // Highlight if hovered
      if (hoveredLeaf === leaf.data?.id) {
        ctx.strokeStyle = '#3b82f6' // Professional blue
        ctx.lineWidth = 2
        ctx.globalAlpha = 0.8
        ctx.stroke()
      }
      
      // Sparkle effect for new leaves
      if (leaf.isNew && leaf.animationStartTime) {
        const elapsed = Date.now() - leaf.animationStartTime
        if (elapsed < 1000) {
          const sparkleOpacity = 1 - (elapsed / 1000)
          ctx.fillStyle = `rgba(255, 255, 255, ${sparkleOpacity * 0.8})`
          for (let i = 0; i < 3; i++) {
            const sparkleX = (Math.random() - 0.5) * currentSize * 2
            const sparkleY = (Math.random() - 0.5) * currentSize * 2
            ctx.beginPath()
            ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      
      ctx.globalAlpha = 1
      ctx.restore()
    })

    // Optional: Add very subtle ambient particles for movement
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'
    for (let i = 0; i < 8; i++) {
      const x = 200 + Math.sin(time * 0.5 + i) * 400
      const y = 200 + Math.cos(time * 0.3 + i * 0.5) * 200
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }

  }, [branches, leaves, animationFrame, hoveredLeaf])

  // Redraw animation
  useEffect(() => {
    drawProfessionalTree()
  }, [drawProfessionalTree])

  // Handle canvas interactions
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    leaves.forEach(leaf => {
      const distance = Math.sqrt((x - leaf.x) ** 2 + (y - leaf.y) ** 2)
      if (distance < leaf.size * 1.5 && leaf.data) {
        toast(leaf.data.text, {
          duration: 4000,
          style: { 
            maxWidth: '400px',
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }
        })
      }
    })
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    let foundLeaf = false
    leaves.forEach(leaf => {
      const distance = Math.sqrt((x - leaf.x) ** 2 + (y - leaf.y) ** 2)
      if (distance < leaf.size * 1.5 && leaf.data) {
        setHoveredLeaf(leaf.data.id)
        canvas.style.cursor = 'pointer'
        foundLeaf = true
      }
    })
    
    if (!foundLeaf) {
      setHoveredLeaf(null)
      canvas.style.cursor = 'default'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="relative">
        <div className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {session?.title || 'Cevap Ağacı Görselleştirmesi'}
                </h1>
                <div className="flex items-center space-x-4">
                  <p className="text-gray-600">
                    Gerçek zamanlı görselleştirme • {treeData.length} cevap
                  </p>
                  {session && (
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${session.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${session.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {session.isActive ? 'Aktif' : 'Sona Erdi'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Yaprakları tıklayarak cevapları görüntüleyin
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-6xl w-full border border-gray-200"
          >
            {session?.question && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <h2 className="text-lg font-medium text-gray-900 mb-2">Soru:</h2>
                <p className="text-base text-gray-700 bg-gray-50 rounded-lg p-4 inline-block border">
                  {session.question}
                </p>
              </motion.div>
            )}

            <div className="flex justify-center">
              {treeData.length > 0 || true ? (
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="max-w-full h-auto rounded-xl border border-gray-200"
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                  style={{ 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                />
              ) : (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4 text-gray-400">🌳</div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    Cevaplar bekleniyor
                  </h3>
                  <p className="text-gray-500">
                    Katılımcılar cevap vermeye başladığında ağaç büyümeye başlayacak
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}