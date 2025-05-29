"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Activity,
  CheckCircle,
  FlaskConical,
  Play,
  Settings,
  Users,
  ArrowRight,
  Loader2,
  Home,
  FileText,
  BarChart3,
  Settings2,
  Thermometer,
  Calendar,
  ClipboardCheck,
  Search,
  User,
  Lock,
  Edit,
  Trash2,
  AlertTriangle,
  QrCode,
} from "lucide-react"

export default function Component() {
  // 로그인 관련 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isGuestMode, setIsGuestMode] = useState(false)
  const [loginCredentials, setLoginCredentials] = useState({ id: "", password: "" })
  const [showLoginError, setShowLoginError] = useState(false)
  const [autoChannelOut, setAutoChannelOut] = useState(false)

  // 기존 상태들
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedSlots, setSelectedSlots] = useState<number[]>([])
  const [channelExtended, setChannelExtended] = useState<{ 1?: boolean; 2?: boolean }>({})
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("home")
  const [activeSubTab, setActiveSubTab] = useState("")

  const [scannedSlots, setScannedSlots] = useState<number[]>([])
  const [showSampleInputDialog, setShowSampleInputDialog] = useState(false)
  const [testingSlots, setTestingSlots] = useState<number[]>([])
  const [slotTestStages, setSlotTestStages] = useState<{
    [key: number]: { stage: string; timeRemaining: number; itemName: string; sampleName: string; chartId: string }
  }>({})
  const [completedTestResults, setCompletedTestResults] = useState<{
    [key: number]: {
      value: string
      unit: string
      status: string
      ranges: {
        정상: string
        의심: string
        비정상: string
      }
    }
  }>({})
  const [sampleInfo, setSampleInfo] = useState<{
    [key: number]: { sampleName: string; chartId: string }
  }>({})

  // 검색 관련 상태
  const [searchQuery, setSearchQuery] = useState("")

  // QC 관련 상태
  const [lastQCDate, setLastQCDate] = useState("2025-05-25")
  const [deviceQCMode, setDeviceQCMode] = useState(false)

  // 설정 관련 상태
  const [settings, setSettings] = useState({
    dateTime: {
      format: "24h",
      auto: true,
      current: new Date().toLocaleString("ko-KR"),
    },
    language: "ko",
    fontSize: "medium",
    chart: {
      ip: "",
      port: "",
    },
    printer: {
      autoPrint: false,
    },
  })

  // 사용자 관리 상태
  const [users, setUsers] = useState([
    { id: "test", password: "1234" },
    { id: "admin", password: "admin123" },
  ])

  // QC 결과 데이터
  const [calibrationResults, setCalibrationResults] = useState([
    {
      id: 1,
      date: "2025-05-28 14:30",
      slot: 1,
      uvData: "98.5",
      position: "50/50",
      result: "Pass",
    },
    {
      id: 2,
      date: "2025-05-28 14:25",
      slot: 2,
      uvData: "99.2",
      position: "51/49",
      result: "Pass",
    },
  ])

  const [slotQCResults, setSlotQCResults] = useState([
    {
      id: 1,
      date: "2025-05-28 15:00",
      slot: 1,
      lot: "LOT001",
      result: "Pass",
    },
    {
      id: 2,
      date: "2025-05-28 14:55",
      slot: 2,
      lot: "LOT002",
      result: "Pass",
    },
  ])

  const [deviceQCResults, setDeviceQCResults] = useState([
    {
      id: 1,
      date: "2025-05-28 16:00",
      slot: 1,
      test: "ANA Kit",
      lot: "LOT003",
      result: "Pass",
    },
    {
      id: 2,
      date: "2025-05-28 15:55",
      slot: 2,
      test: "Anti-dsDNA",
      lot: "LOT004",
      result: "Fail",
    },
  ])

  // recentResults를 상태로 변경
  const [recentResults, setRecentResults] = useState([
    {
      id: "R001",
      sampleId: "S002",
      patient: "이○○",
      chartId: "C2025052802",
      slot: 4,
      test: "Anti-dsDNA",
      lot: "LOT001",
      result: "음성",
      interpretation: "정상",
      date: "2025-05-28 14:15",
    },
    {
      id: "R002",
      sampleId: "S003",
      patient: "박○○",
      chartId: "C2025052803",
      slot: 3,
      test: "ANA",
      lot: "LOT002",
      result: "양성",
      interpretation: "비정상",
      date: "2025-05-28 13:45",
    },
    {
      id: "R003",
      sampleId: "S004",
      patient: "최○○",
      chartId: "C2025052804",
      slot: 1,
      test: "Anti-CCP",
      lot: "LOT003",
      result: "음성",
      interpretation: "정상",
      date: "2025-05-28 13:30",
    },
    {
      id: "R004",
      sampleId: "S005",
      patient: "정○○",
      chartId: "C2025052805",
      slot: 2,
      test: "RF",
      lot: "LOT004",
      result: "양성",
      interpretation: "비정상",
      date: "2025-05-28 13:15",
    },
    {
      id: "R005",
      sampleId: "S006",
      patient: "한○○",
      chartId: "C2025052806",
      slot: 1,
      test: "ANCA",
      lot: "LOT005",
      result: "음성",
      interpretation: "정상",
      date: "2025-05-28 12:45",
    },
  ])

  // 시간 업데이트 및 포맷팅
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCurrentTime = (date: Date, format: string) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")

    if (format === "24h") {
      const formattedHours = hours.toString().padStart(2, "0")
      return `${year}.${month}.${day} ${formattedHours}:${minutes}:${seconds}`
    } else {
      const period = hours >= 12 ? "오후" : "오전"
      const formattedHours = (hours % 12 || 12).toString().padStart(2, "0")
      return `${year}.${month}.${day} ${period} ${formattedHours}:${minutes}:${seconds}`
    }
  }

  // 로그인 시 자동 채널 확장 처리
  useEffect(() => {
    if (isLoggedIn && autoChannelOut) {
      setChannelExtended({ 1: true, 2: true })
      setActiveTab("test")
    }
  }, [isLoggedIn, autoChannelOut])

  // 스캔 진행 시뮬레이션
  useEffect(() => {
    if (scanning) {
      const timer = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            setScanning(false)
            setScannedSlots([...selectedSlots])
            // 구성품 확인 완료 후 검체 투입 팝업 표시
            setShowSampleInputDialog(true)
            clearInterval(timer)
            return 100
          }
          return prev + 5
        })
      }, 200)
      return () => clearInterval(timer)
    }
  }, [scanning, selectedSlots])

  // 로그인 처리
  const handleLogin = () => {
    const user = users.find((u) => u.id === loginCredentials.id && u.password === loginCredentials.password)
    if (user) {
      setIsLoggedIn(true)
      setIsGuestMode(false)
      setShowLoginError(false)
      if (!autoChannelOut) {
        setActiveTab("home")
      }
    } else {
      setShowLoginError(true)
    }
  }

  // 게스트 모드 처리
  const handleGuestMode = () => {
    setIsLoggedIn(true)
    setIsGuestMode(true)
    setActiveTab("home")
  }

  // 키보드 엔터 처리
  const handleKeyDown = (e: React.KeyboardEvent, action?: () => void) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (action) action()
      ;(e.target as HTMLElement).blur()
    }
  }

  // 장비 상태 데이터
  const systemStatus = {
    overall: "정상",
    temperature: "25°C",
    pressure: "1013 hPa",
    lastQC: lastQCDate,
    nextMaintenance: "2025-06-15",
  }

  // 통계 데이터
  const statsData = {
    totalTests: 1458,
    todayTests: 24,
    temperature: "25°C",
  }

  // 슬롯 데이터
  const slots = [
    { id: 1, channel: 1, status: "대기중", sample: null, timestamp: null },
    { id: 2, channel: 1, status: "대기중", sample: null, timestamp: null },
    { id: 3, channel: 2, status: "대기중", sample: null, timestamp: null },
    { id: 4, channel: 2, status: "대기중", sample: null, timestamp: null },
  ]

  // 채널별 검사 상태를 관리하는 새로운 상태 추가:
  const [channelTestingState, setChannelTestingState] = useState<{
    [key: number]: { isActive: boolean; activeSlot: number | null }
  }>({
    1: { isActive: false, activeSlot: null },
    2: { isActive: false, activeSlot: null },
  })

  // 검사 진행 중인 슬롯을 최신순으로 정렬 (반응시간 기준)
  const activeSlots = [...slots]
    .filter((slot) => slot.status === "진행중" || slot.status === "완료" || testingSlots.includes(slot.id))
    .sort((a, b) => {
      // 검사 중인 슬롯이 우선
      if (testingSlots.includes(a.id) && !testingSlots.includes(b.id)) return -1
      if (!testingSlots.includes(a.id) && testingSlots.includes(b.id)) return 1

      // 타임스탬프가 있는 경우 최신순
      if (a.timestamp && b.timestamp) {
        return b.timestamp.getTime() - a.timestamp.getTime()
      }

      // 타임스탬프가 없는 경우 슬롯 ID 순
      return a.id - b.id
    })

  const simulateTestProgress = () => {
    const stages = ["검체 희석중", "검체 투입중", "검사 진행중", "분석중", "검사 완료"]
    const stageDurations = [5, 5, 10, 5, 0] // 5초, 5초, 10초, 5초, 완료

    const progressTimer = setInterval(() => {
      setSlotTestStages((prev) => {
        const updated = { ...prev }
        let allCompleted = true

        Object.keys(updated).forEach((slotIdStr) => {
          const slotId = Number.parseInt(slotIdStr)
          const current = updated[slotId]

          if (current.stage !== "검사 완료") {
            allCompleted = false
            const newTimeRemaining = Math.max(0, current.timeRemaining - 1)

            if (newTimeRemaining === 0) {
              const currentStageIndex = stages.indexOf(current.stage)
              const nextStageIndex = Math.min(currentStageIndex + 1, stages.length - 1)
              updated[slotId] = {
                ...current,
                stage: stages[nextStageIndex],
                timeRemaining: stageDurations[nextStageIndex],
              }

              // 검사 완료 시 결과 생성
              if (stages[nextStageIndex] === "검사 완료") {
                const randomValue = (Math.random() * 30).toFixed(1)
                const numValue = Number.parseFloat(randomValue)
                let status = "정상"
                let result = "음성"
                let interpretation = "정상"

                if (numValue > 20) {
                  status = "비정상"
                  result = "양성"
                  interpretation = "비정상"
                } else if (numValue > 10) {
                  status = "의심"
                  result = "양성"
                  interpretation = "의심"
                }

                setCompletedTestResults((prevResults) => ({
                  ...prevResults,
                  [slotId]: {
                    value: randomValue,
                    unit: "ng/mL",
                    status: status,
                    ranges: {
                      정상: "0 - 10 ng/mL",
                      의심: "10 - 20 ng/mL",
                      비정상: "20 - 30 ng/mL",
                    },
                  },
                }))

                // 검사 결과 탭에 새로운 결과 추가
                const newResult = {
                  id: `R${Date.now()}`,
                  sampleId: `S${Date.now()}`,
                  patient: updated[slotId].sampleName || `검체${slotId}`,
                  chartId: updated[slotId].chartId || `C${Date.now()}`,
                  slot: slotId,
                  test: updated[slotId].itemName,
                  lot: `LOT${Math.floor(Math.random() * 1000)
                    .toString()
                    .padStart(3, "0")}`,
                  result: result,
                  interpretation: interpretation,
                  date: new Date()
                    .toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .replace(/\. /g, "-")
                    .replace(/\./g, "")
                    .replace(/-(\d{2}:\d{2})/, " $1"),
                }

                setRecentResults((prevResults) => [newResult, ...prevResults])
              }
            } else {
              updated[slotId] = {
                ...current,
                timeRemaining: newTimeRemaining,
              }
            }
          }
        })

        if (allCompleted) {
          clearInterval(progressTimer)
        }

        return updated
      })
    }, 1000)
  }

  // 기타 헬퍼 함수들
  const getResultColor = (result: string) => {
    switch (result) {
      case "양성":
        return "text-red-600"
      case "음성":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getInterpretationColor = (interpretation: string) => {
    switch (interpretation) {
      case "양성":
      case "비정상":
        return "text-red-600"
      case "정상":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case "진행중":
        return "bg-blue-500"
      case "대기중":
        return "bg-yellow-500"
      case "완료":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // 채널별 검사 진행 상태를 추적하기 위한 상태 추가
  const [activeChannels, setActiveChannels] = useState<{ [key: number]: boolean }>({})

  // handleSlotClick 함수를 수정하여 채널 간 독립성 보장 및 같은 채널 내 슬롯 제한
  const handleSlotClick = (slotId: number) => {
    if (scanning) return

    const slot = slots.find((s) => s.id === slotId)
    if (!slot) return

    // 검사 완료된 슬롯 클릭 시에만 초기화
    if (testingSlots.includes(slotId) && slotTestStages[slotId]?.stage === "검사 완료") {
      // 해당 슬롯만 초기화 (다른 슬롯에 영향 없음)
      setTestingSlots(testingSlots.filter((id) => id !== slotId))
      setSlotTestStages((prev) => {
        const updated = { ...prev }
        delete updated[slotId]
        return updated
      })
      setCompletedTestResults((prev) => {
        const updated = { ...prev }
        delete updated[slotId]
        return updated
      })
      setSampleInfo((prev) => {
        const updated = { ...prev }
        delete updated[slotId]
        return updated
      })
      setScannedSlots(scannedSlots.filter((id) => id !== slotId))

      // 해당 슬롯의 채널 테스팅 상태만 해제 (다른 채널에 영향 없음)
      const sameChannelSlots = slots.filter((s) => s.channel === slot.channel).map((s) => s.id)
      const hasOtherActiveSlots = sameChannelSlots.some(
        (id) => id !== slotId && (testingSlots.includes(id) || scannedSlots.includes(id)),
      )

      if (!hasOtherActiveSlots) {
        setChannelTestingState((prev) => ({
          ...prev,
          [slot.channel]: { isActive: false, activeSlot: null },
        }))
      }
      return
    }

    // 이미 스캔되었거나 검사 중인 슬롯은 클릭 불가
    if (scannedSlots.includes(slotId) || testingSlots.includes(slotId)) {
      return
    }

    // 같은 채널에서 다른 슬롯이 이미 검사 중인지 확인 (다른 채널은 영향 없음)
    const channelState = channelTestingState[slot.channel]
    if (channelState.isActive && channelState.activeSlot !== null && channelState.activeSlot !== slotId) {
      alert(
        `채널 ${slot.channel}에서 슬롯 ${channelState.activeSlot}이 이미 검사 중입니다. 같은 채널의 다른 슬롯은 선택할 수 없습니다.`,
      )
      return
    }

    // 채널이 확장되지 않은 경우 - 채널 out
    if (!channelExtended[slot.channel as 1 | 2]) {
      setChannelExtended({ ...channelExtended, [slot.channel]: true })
      // 다른 채널의 선택된 슬롯은 유지
      const otherChannelSlots = selectedSlots.filter((id) => {
        const s = slots.find((slot) => slot.id === id)
        return s && s.channel !== slot.channel
      })
      setSelectedSlots([...otherChannelSlots, slotId])
      setShowInstallDialog(true)
      return
    }

    // 채널이 확장된 경우 - 구성품 장착 가이드 표시
    if (selectedSlots.includes(slotId)) {
      setShowInstallDialog(true)
    } else {
      // 다른 채널의 선택된 슬롯은 유지하고 같은 채널의 슬롯만 업데이트
      const otherChannelSlots = selectedSlots.filter((id) => {
        const s = slots.find((slot) => slot.id === id)
        return s && s.channel !== slot.channel
      })
      setSelectedSlots([...otherChannelSlots, slotId])
      setShowInstallDialog(true)
    }
  }

  // handleStartTest 함수 수정 - 검사 시작 시 채널 활성화 상태 업데이트
  const handleStartTest = () => {
    setShowSampleInputDialog(false)

    // 검사 진행 시 채널 in
    const channelsToCollapse: { [key: number]: boolean } = {}
    scannedSlots.forEach((slotId) => {
      const slot = slots.find((s) => s.id === slotId)
      if (slot) {
        channelsToCollapse[slot.channel] = false
      }
    })
    setChannelExtended((prev) => ({ ...prev, ...channelsToCollapse }))

    // 선택된 슬롯 순서대로 검사 시작
    const sortedSlots = [...scannedSlots].sort((a, b) => a - b)

    // 첫 번째 슬롯부터 시작
    if (sortedSlots.length > 0) {
      const firstSlot = sortedSlots[0]
      const slot = slots.find((s) => s.id === firstSlot)

      if (slot) {
        // 채널 테스팅 상태 설정
        setChannelTestingState((prev) => ({
          ...prev,
          [slot.channel]: { isActive: true, activeSlot: firstSlot },
        }))
      }

      setTestingSlots([firstSlot])

      const initialStage = {
        [firstSlot]: {
          stage: "검체 희석중",
          timeRemaining: 5,
          itemName: deviceQCMode ? "QC Kit" : "ANA Kit",
          sampleName: sampleInfo[firstSlot]?.sampleName || "",
          chartId: sampleInfo[firstSlot]?.chartId || "",
        },
      }
      setSlotTestStages(initialStage)

      // 순차적 검사 진행 시뮬레이션
      simulateSequentialTestProgress(sortedSlots, 0)
    }
  }

  // 순차적 검사 진행을 위한 새로운 함수 추가:
  const simulateSequentialTestProgress = (slotQueue: number[], currentIndex: number) => {
    if (currentIndex >= slotQueue.length) return

    const currentSlotId = slotQueue[currentIndex]
    const stages = ["검체 희석중", "검체 투입중", "검사 진행중", "분석중", "검사 완료"]
    const stageDurations = [5, 5, 10, 5, 0]

    const progressTimer = setInterval(() => {
      setSlotTestStages((prev) => {
        const updated = { ...prev }
        const current = updated[currentSlotId]

        if (!current || current.stage === "검사 완료") {
          clearInterval(progressTimer)

          // 검사 완료 시 결과 생성 로직...

          // 검사 완료 시 결과 생성
          if (current && current.stage === "검사 완료") {
            const randomValue = (Math.random() * 30).toFixed(1)
            const numValue = Number.parseFloat(randomValue)
            let status = "정상"
            let result = "음성"
            let interpretation = "정상"

            if (numValue > 20) {
              status = "비정상"
              result = "양성"
              interpretation = "비정상"
            } else if (numValue > 10) {
              status = "의심"
              result = "양성"
              interpretation = "의심"
            }

            setCompletedTestResults((prevResults) => ({
              ...prevResults,
              [currentSlotId]: {
                value: randomValue,
                unit: "ng/mL",
                status: status,
                ranges: {
                  정상: "0 - 10 ng/mL",
                  의심: "10 - 20 ng/mL",
                  비정상: "20 - 30 ng/mL",
                },
              },
            }))

            // 검사 결과 탭에 새로운 결과 추가
            const newResult = {
              id: `R${Date.now()}`,
              sampleId: `S${Date.now()}`,
              patient: current.sampleName || `검체${currentSlotId}`,
              chartId: current.chartId || `C${Date.now()}`,
              slot: currentSlotId,
              test: current.itemName,
              lot: `LOT${Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, "0")}`,
              result: result,
              interpretation: interpretation,
              date: new Date()
                .toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                .replace(/\. /g, "-")
                .replace(/\./g, "")
                .replace(/-(\d{2}:\d{2})/, " $1"),
            }

            setRecentResults((prevResults) => [newResult, ...prevResults])
          }

          // 다음 슬롯으로 이동
          const nextIndex = currentIndex + 1
          if (nextIndex < slotQueue.length) {
            const nextSlotId = slotQueue[nextIndex]
            const nextSlot = slots.find((s) => s.id === nextSlotId)

            if (nextSlot) {
              setChannelTestingState((prev) => ({
                ...prev,
                [nextSlot.channel]: { isActive: true, activeSlot: nextSlotId },
              }))

              setTestingSlots((prev) => [...prev, nextSlotId])

              setSlotTestStages((prev) => ({
                ...prev,
                [nextSlotId]: {
                  stage: "검체 희석중",
                  timeRemaining: 5,
                  itemName: deviceQCMode ? "QC Kit" : "ANA Kit",
                  sampleName: sampleInfo[nextSlotId]?.sampleName || "",
                  chartId: sampleInfo[nextSlotId]?.chartId || "",
                },
              }))

              simulateSequentialTestProgress(slotQueue, nextIndex)
            }
          } else {
            // 모든 슬롯 완료 시 채널 테스팅 상태 해제
            const currentSlot = slots.find((s) => s.id === currentSlotId)
            if (currentSlot) {
              setChannelTestingState((prev) => ({
                ...prev,
                [currentSlot.channel]: { isActive: false, activeSlot: null },
              }))
            }
          }
          return updated
        }

        const newTimeRemaining = Math.max(0, current.timeRemaining - 1)

        if (newTimeRemaining === 0) {
          const currentStageIndex = stages.indexOf(current.stage)
          const nextStageIndex = Math.min(currentStageIndex + 1, stages.length - 1)
          updated[currentSlotId] = {
            ...current,
            stage: stages[nextStageIndex],
            timeRemaining: stageDurations[nextStageIndex],
          }

          // "검체 투입중" → "검사 진행중"으로 넘어가는 시점에 다음 슬롯 시작
          if (current.stage === "검체 투입중" && stages[nextStageIndex] === "검사 진행중") {
            const nextIndex = currentIndex + 1
            if (nextIndex < slotQueue.length) {
              const nextSlotId = slotQueue[nextIndex]
              const nextSlot = slots.find((s) => s.id === nextSlotId)

              if (nextSlot) {
                setChannelTestingState((prev) => ({
                  ...prev,
                  [nextSlot.channel]: { isActive: true, activeSlot: nextSlotId },
                }))

                setTestingSlots((prev) => [...prev, nextSlotId])

                setSlotTestStages((prev) => ({
                  ...prev,
                  [nextSlotId]: {
                    stage: "검체 희석중",
                    timeRemaining: 5,
                    itemName: deviceQCMode ? "QC Kit" : "ANA Kit",
                    sampleName: sampleInfo[nextSlotId]?.sampleName || "",
                    chartId: sampleInfo[nextSlotId]?.chartId || "",
                  },
                }))

                simulateSequentialTestProgress(slotQueue, nextIndex)
              }
            }
          }
        } else {
          updated[currentSlotId] = {
            ...current,
            timeRemaining: newTimeRemaining,
          }
        }

        return updated
      })
    }, 1000)
  }

  // handleChannelSelectAll 함수 수정 - 채널 간 독립성 보장
  const handleChannelSelectAll = (channel: number) => {
    // 해당 채널이 이미 활성화되어 있는지 확인
    if (activeChannels[channel]) {
      alert(`채널 ${channel}에 이미 검사가 진행 중입니다.`)
      return
    }

    const channelSlots = slots.filter((slot) => slot.channel === channel).map((slot) => slot.id)
    const availableSlots = channelSlots.filter(
      (slotId) => !scannedSlots.includes(slotId) && !testingSlots.includes(slotId),
    )

    // 다른 채널의 선택된 슬롯은 유지
    const otherChannelSlots = selectedSlots.filter((id) => {
      const slot = slots.find((s) => s.id === id)
      return slot && slot.channel !== channel
    })

    setSelectedSlots([...otherChannelSlots, ...availableSlots])
  }

  // handleCancelTest 함수 수정 - 취소 시 채널 활성화 상태 초기화
  const handleCancelTest = () => {
    setShowSampleInputDialog(false)
    setScannedSlots([])
    setSelectedSlots([])

    // 모든 채널 테스팅 상태 해제
    setChannelTestingState({
      1: { isActive: false, activeSlot: null },
      2: { isActive: false, activeSlot: null },
    })
  }

  // 새 검사 시작 버튼 핸들러
  const handleNewTestStart = () => {
    setActiveTab("test")
    // 확장되지 않은 채널 확장
    const newChannelState = { ...channelExtended }
    if (!channelExtended[1]) newChannelState[1] = true
    if (!channelExtended[2]) newChannelState[2] = true
    setChannelExtended(newChannelState)
  }

  // 슬롯 QC 완료 핸들러
  const handleSlotQCComplete = () => {
    const today = new Date().toISOString().split("T")[0]
    setLastQCDate(today)
  }

  // 로그인 화면
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 w-[1920px] mx-auto">
        <Card className="w-[600px] p-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">면역형광자동화 시스템</CardTitle>
            <CardDescription className="text-xl">AutoIF-3000</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-lg font-medium block mb-2">ID</label>
                <Input
                  placeholder="ID를 입력하세요"
                  value={loginCredentials.id}
                  onChange={(e) => setLoginCredentials({ ...loginCredentials, id: e.target.value })}
                  onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                  className="text-lg py-3"
                />
              </div>
              <div>
                <label className="text-lg font-medium block mb-2">Password</label>
                <div className="flex gap-3">
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={loginCredentials.password}
                    onChange={(e) => setLoginCredentials({ ...loginCredentials, password: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, handleLogin)}
                    className="text-lg py-3 flex-1"
                  />
                  <Button onClick={handleLogin} className="text-lg py-3 px-6">
                    로그인
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={handleGuestMode} className="w-full text-lg py-3">
              게스트 모드
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoChannelOut"
                  checked={autoChannelOut}
                  onCheckedChange={(checked) => setAutoChannelOut(checked as boolean)}
                />
                <label htmlFor="autoChannelOut" className="text-lg">
                  로그인 시 채널 Out/In
                </label>
              </div>
            </div>

            {showLoginError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">ID, password를 확인해 주세요.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleChannelDeselectAll = (channel: number) => {
    const channelSlots = slots.filter((slot) => slot.channel === channel).map((slot) => slot.id)
    setSelectedSlots(selectedSlots.filter((id) => !channelSlots.includes(id)))
  }

  const handleCancelInstall = () => {
    setShowInstallDialog(false)
  }

  const handleInstallComplete = () => {
    setScanning(true)
    setShowInstallDialog(false)
    // 구성품 확인 후 채널 out (확장 상태 유지)
  }

  return (
    <div className="flex h-screen bg-gray-50 w-[1920px] mx-auto">
      {/* 왼쪽 사이드바 네비게이션 */}
      <div className="w-64 border-r bg-white p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">면역형광자동화 시스템</h1>
          <p className="text-sm text-gray-600 mt-2">AutoIF-3000</p>
          {isGuestMode && (
            <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-800">
              게스트 모드
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            className="w-full justify-start text-lg py-3"
            onClick={() => {
              setActiveTab("home")
              setActiveSubTab("")
              setDeviceQCMode(false)
            }}
          >
            <Home className="h-5 w-5 mr-3" />홈
          </Button>
          <Button
            variant={activeTab === "test" ? "default" : "ghost"}
            className="w-full justify-start text-lg py-3"
            onClick={() => {
              setActiveTab("test")
              setActiveSubTab("")
              setDeviceQCMode(false)
            }}
          >
            <FlaskConical className="h-5 w-5 mr-3" />
            검사
          </Button>
          <Button
            variant={activeTab === "results" ? "default" : "ghost"}
            className="w-full justify-start text-lg py-3"
            onClick={() => {
              setActiveTab("results")
              setActiveSubTab("")
              setDeviceQCMode(false)
            }}
          >
            <FileText className="h-5 w-5 mr-3" />
            검사 결과
          </Button>
          <Button
            variant={activeTab === "qc" ? "default" : "ghost"}
            className="w-full justify-start text-lg py-3"
            onClick={() => {
              setActiveTab("qc")
              setActiveSubTab("")
              setDeviceQCMode(false)
            }}
          >
            <ClipboardCheck className="h-5 w-5 mr-3" />
            QC
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start text-lg py-3"
            onClick={() => {
              setActiveTab("settings")
              setActiveSubTab("")
              setDeviceQCMode(false)
            }}
          >
            <Settings2 className="h-5 w-5 mr-3" />
            설정
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="text-sm text-gray-500">현재 시간</div>
          <div className="font-mono text-lg mt-1">{formatCurrentTime(currentTime, settings.dateTime.format)}</div>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="w-full text-lg py-3"
            onClick={() => {
              setIsLoggedIn(false)
              setIsGuestMode(false)
              setLoginCredentials({ id: "", password: "" })
              setActiveTab("home")
              setActiveSubTab("")
              setDeviceQCMode(false)
            }}
          >
            로그아웃
          </Button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 p-6 overflow-auto">
        {/* 홈 탭 */}
        {activeTab === "home" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" className="p-4" onClick={() => alert("QR 코드 스캔 기능")}>
                  <QrCode className="h-8 w-8" />
                </Button>
                <Button variant="outline" size="lg" className="p-4" onClick={() => setActiveTab("settings")}>
                  <Settings className="h-8 w-8" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* 통계 요약 */}
              <Card className="xl:col-span-4">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="p-6 border-r border-b md:border-b-0 flex items-center">
                      <div className="bg-blue-100 p-4 rounded-full mr-6">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg text-gray-500">총 테스트 횟수</p>
                        <p className="text-2xl font-bold">{statsData.totalTests}</p>
                      </div>
                    </div>
                    <div className="p-6 border-r border-b md:border-b-0 flex items-center">
                      <div className="bg-red-100 p-4 rounded-full mr-6">
                        <Thermometer className="h-8 w-8 text-red-600" />
                      </div>
                      <div>
                        <p className="text-lg text-gray-500">장비 온도</p>
                        <p className="text-2xl font-bold">{statsData.temperature}</p>
                      </div>
                    </div>
                    <div className="p-6 flex items-center">
                      <div className="bg-green-100 p-4 rounded-full mr-6">
                        <Activity className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg text-gray-500">오늘 테스트 수</p>
                        <p className="text-2xl font-bold">{statsData.todayTests}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 장비 상태 - 습도 제거 */}
              <Card className="xl:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Activity className="h-6 w-6" />
                    장비 상태
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">시스템 상태</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {systemStatus.overall}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Thermometer className="h-5 w-5 text-red-500" />
                        <span className="text-lg">온도</span>
                      </div>
                      <span className="font-mono text-lg">{systemStatus.temperature}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClipboardCheck className="h-5 w-5 text-green-500" />
                        <span className="text-lg">마지막 QC</span>
                      </div>
                      <span className="font-mono text-lg">{systemStatus.lastQC}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-purple-500" />
                        <span className="text-lg">다음 정비</span>
                      </div>
                      <span className="font-mono text-lg">{systemStatus.nextMaintenance}</span>
                    </div>
                  </div>

                  <Button className="w-full text-lg py-3" variant="outline" onClick={() => setActiveTab("qc")}>
                    <Activity className="h-5 w-5 mr-3" />
                    상세 진단
                  </Button>
                </CardContent>
              </Card>

              {/* 검사 현황 - 최신 순서로 정렬 */}
              <Card className="xl:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <FlaskConical className="h-6 w-6" />
                    검사 현황
                  </CardTitle>
                  <CardDescription className="text-lg">
                    진행중 {slots.filter((s) => s.status === "진행중").length}개 | 완료{" "}
                    {slots.filter((s) => s.status === "완료").length}개
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeSlots.length > 0 ? (
                      activeSlots.map((slot) => (
                        <div key={slot.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="outline"
                                className={
                                  testingSlots.includes(slot.id)
                                    ? "bg-yellow-500 text-lg"
                                    : getSlotStatusColor(slot.status) + " text-lg"
                                }
                              >
                                {testingSlots.includes(slot.id)
                                  ? slotTestStages[slot.id]?.stage || "검사중"
                                  : scannedSlots.includes(slot.id)
                                    ? "스캔 완료"
                                    : selectedSlots.includes(slot.id)
                                      ? "선택됨"
                                      : slot.status}
                              </Badge>
                              <span className="font-medium text-lg">슬롯 {slot.id}</span>
                            </div>
                          </div>

                          {/* 슬롯 내용 표시 로직은 기존과 동일하게 유지 */}
                          {slot.sample ? (
                            <div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                  <div className="text-sm text-gray-500">검체명</div>
                                  <div className="text-lg font-medium">{slot.sample.patient}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Chart ID</div>
                                  <div className="text-lg font-medium">{slot.sample.chartId}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">검사항목</div>
                                  <div className="text-lg font-medium">{slot.sample.test}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">진행률</div>
                                  <div className="text-lg font-medium">{slot.sample.progress}%</div>
                                </div>
                              </div>
                              {slot.status === "진행중" && <Progress value={slot.sample.progress} className="h-3" />}
                            </div>
                          ) : testingSlots.includes(slot.id) && slotTestStages[slot.id] ? (
                            <div>
                              {slotTestStages[slot.id].stage === "검사 완료" && completedTestResults[slot.id] ? (
                                // 검사 완료된 경우 결과 표시
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div>
                                      <div className="text-sm text-gray-500">검사항목</div>
                                      <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">검체명</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].sampleName || "미입력"}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Chart ID</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].chartId || "미입력"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center p-4 border rounded-lg bg-gray-50">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                      {completedTestResults[slot.id].value} {completedTestResults[slot.id].unit}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xl px-4 py-2 ${
                                        completedTestResults[slot.id].status === "정상"
                                          ? "bg-green-100 text-green-800 border-green-300"
                                          : completedTestResults[slot.id].status === "의심"
                                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                            : "bg-red-100 text-red-800 border-red-300"
                                      }`}
                                    >
                                      {completedTestResults[slot.id].status}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2 text-lg">
                                    <div className="font-medium">결과 해석 범위:</div>
                                    <div className="grid grid-cols-1 gap-1">
                                      <div className="flex justify-between">
                                        <span className="text-green-600">정상:</span>
                                        <span>{completedTestResults[slot.id].ranges.정상}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-yellow-600">의심:</span>
                                        <span>{completedTestResults[slot.id].ranges.의심}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-red-600">비정상:</span>
                                        <span>{completedTestResults[slot.id].ranges.비정상}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center p-2 border rounded-lg bg-blue-50">
                                    <div className="text-lg text-blue-800 font-medium">터치하여 슬롯 초기화</div>
                                  </div>
                                </div>
                              ) : (
                                // 검사 진행 중인 경우 (기존 로직 유지)
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <div className="text-sm text-gray-500">검사항목</div>
                                      <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">검체명</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].sampleName || "미입력"}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Chart ID</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].chartId || "미입력"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-lg">
                                      {slotTestStages[slot.id].stage}
                                    </Badge>
                                    {(slotTestStages[slot.id].stage === "검사 진행중" ||
                                      slotTestStages[slot.id].stage === "분석중") && (
                                      <div className="text-xl font-mono font-bold text-blue-600">
                                        {formatTime(slotTestStages[slot.id].timeRemaining)}
                                      </div>
                                    )}
                                  </div>
                                  <Progress
                                    value={
                                      slotTestStages[slot.id].stage === "검사 완료"
                                        ? 100
                                        : slotTestStages[slot.id].stage === "분석중"
                                          ? 90
                                          : slotTestStages[slot.id].stage === "검사 진행중"
                                            ? 75
                                            : slotTestStages[slot.id].stage === "검체 투입중"
                                              ? 50
                                              : 25
                                    }
                                    className="h-3"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-500 text-lg">검체 정보 없음</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 text-lg">현재 진행 중인 검사가 없습니다.</div>
                    )}
                  </div>

                  {scanning && (
                    <div className="p-6 border rounded-lg bg-blue-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                          <span className="font-medium text-blue-800 text-lg">
                            {scanProgress < 50
                              ? "구성품 스캔 중..."
                              : scanProgress < 100
                                ? "구성품 확인 중..."
                                : "구성품 확인 완료"}
                          </span>
                        </div>
                        <span className="text-lg text-blue-600">{scanProgress}%</span>
                      </div>
                      <Progress value={scanProgress} className="h-3" />
                    </div>
                  )}

                  <div className="mt-6">
                    <Button className="w-full text-lg py-3" onClick={handleNewTestStart}>
                      <Play className="h-5 w-5 mr-3" />새 검사 시작
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 최근 검사 결과 - 3개만 표시, 순서 변경 */}
              <Card className="xl:col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <CheckCircle className="h-6 w-6" />
                    최근 검사 결과
                  </CardTitle>
                  <CardDescription className="text-lg">최근 3개 검사 결과</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">번호</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">검체명</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Chart ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">슬롯 번호</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">검사항목</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Lot</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">결과</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">결과 해석</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentResults.slice(0, 3).map((result, index) => (
                          <tr key={result.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{result.date}</td>
                            <td className="py-3 px-4">{result.patient}</td>
                            <td className="py-3 px-4 font-mono text-sm">{result.chartId}</td>
                            <td className="py-3 px-4">{result.slot}</td>
                            <td className="py-3 px-4">{result.test}</td>
                            <td className="py-3 px-4">{result.lot}</td>
                            <td className="py-3 px-4">
                              <span className={getResultColor(result.result)}>{result.result}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={getInterpretationColor(result.interpretation)}>
                                {result.interpretation}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 text-lg py-3"
                    onClick={() => setActiveTab("results")}
                  >
                    전체 결과 보기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 검사 탭 - 독립적인 채널 In/Out */}
        {activeTab === "test" && !deviceQCMode && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">검사</h1>
              <Button className="text-lg py-3" onClick={handleNewTestStart}>
                <Play className="h-5 w-5 mr-3" />새 검사 시작
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-6">
                {/* 채널 1 그룹 */}
                <Card className="border-blue-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 text-lg">
                          채널 1
                        </Badge>
                        <span className="text-lg text-gray-600">슬롯 1, 2</span>
                        {channelExtended[1] && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-lg">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            확장됨
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all ${channelExtended[1] ? "transform translate-x-6" : ""}`}
                    >
                      {slots
                        .filter((slot) => slot.channel === 1)
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedSlots.includes(slot.id)
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : scannedSlots.includes(slot.id)
                                  ? "border-green-500 bg-green-50 ring-2 ring-green-200 cursor-not-allowed"
                                  : testingSlots.includes(slot.id)
                                    ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200 cursor-not-allowed"
                                    : "hover:border-blue-300"
                            }`}
                            onClick={() => handleSlotClick(slot.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    testingSlots.includes(slot.id)
                                      ? "bg-yellow-500 text-white text-lg"
                                      : scannedSlots.includes(slot.id)
                                        ? "bg-green-500 text-white text-lg"
                                        : selectedSlots.includes(slot.id)
                                          ? "bg-blue-500 text-white text-lg"
                                          : getSlotStatusColor(slot.status) + " text-lg"
                                  }
                                >
                                  {testingSlots.includes(slot.id)
                                    ? slotTestStages[slot.id]?.stage || "검사중"
                                    : scannedSlots.includes(slot.id)
                                      ? "스캔 완료"
                                      : selectedSlots.includes(slot.id)
                                        ? "선택됨"
                                        : slot.status}
                                </Badge>
                                <span className="font-medium text-lg">슬롯 {slot.id}</span>
                              </div>
                            </div>

                            {/* 슬롯 내용 표시 로직 */}
                            {testingSlots.includes(slot.id) && slotTestStages[slot.id] ? (
                              <div>
                                {slotTestStages[slot.id].stage === "검사 완료" && completedTestResults[slot.id] ? (
                                  // 검사 완료된 경우 결과 표시
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                      <div>
                                        <div className="text-sm text-gray-500">검사항목</div>
                                        <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">검체명</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].sampleName || "미입력"}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Chart ID</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].chartId || "미입력"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg bg-gray-50">
                                      <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {completedTestResults[slot.id].value} {completedTestResults[slot.id].unit}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`text-xl px-4 py-2 ${
                                          completedTestResults[slot.id].status === "정상"
                                            ? "bg-green-100 text-green-800 border-green-300"
                                            : completedTestResults[slot.id].status === "의심"
                                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                              : "bg-red-100 text-red-800 border-red-300"
                                        }`}
                                      >
                                        {completedTestResults[slot.id].status}
                                      </Badge>
                                    </div>
                                    <div className="space-y-2 text-lg">
                                      <div className="font-medium">결과 해석 범위:</div>
                                      <div className="grid grid-cols-1 gap-1">
                                        <div className="flex justify-between">
                                          <span className="text-green-600">정상:</span>
                                          <span>{completedTestResults[slot.id].ranges.정상}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-yellow-600">의심:</span>
                                          <span>{completedTestResults[slot.id].ranges.의심}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-red-600">비정상:</span>
                                          <span>{completedTestResults[slot.id].ranges.비정상}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center p-2 border rounded-lg bg-blue-50">
                                      <div className="text-lg text-blue-800 font-medium">터치하여 슬롯 초기화</div>
                                    </div>
                                  </div>
                                ) : (
                                  // 검사 진행 중인 경우
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      <div>
                                        <div className="text-sm text-gray-500">검사항목</div>
                                        <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">검체명</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].sampleName || "미입력"}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Chart ID</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].chartId || "미입력"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-sm">
                                        {slotTestStages[slot.id].stage}
                                      </Badge>
                                      {(slotTestStages[slot.id].stage === "검사 진행중" ||
                                        slotTestStages[slot.id].stage === "분석중") && (
                                        <div className="text-xl font-mono font-bold text-blue-600">
                                          {formatTime(slotTestStages[slot.id].timeRemaining)}
                                        </div>
                                      )}
                                    </div>
                                    <Progress
                                      value={
                                        slotTestStages[slot.id].stage === "검사 완료"
                                          ? 100
                                          : slotTestStages[slot.id].stage === "분석중"
                                            ? 90
                                            : slotTestStages[slot.id].stage === "검사 진행중"
                                              ? 75
                                              : slotTestStages[slot.id].stage === "검체 투입중"
                                                ? 50
                                                : 25
                                    }
                                    className="h-3"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-lg text-gray-500 flex items-center justify-center h-16">
                              비어있음
                            </div>
                          )}
                        </div>
                      ))
                    </div>
                    {/* 채널 1 In/Out 컨트롤 */}
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 text-lg">
                            채널 1 상태
                          </Badge>
                          <Badge
                            variant={channelExtended[1] ? "outline" : "secondary"}
                            className={channelExtended[1] ? "bg-green-100 text-green-800 text-lg" : "text-lg"}
                          >
                            {channelExtended[1] ? "확장됨" : "접힘"}
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          {channelExtended[1] ? (
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 1: false })
                                setSelectedSlots(selectedSlots.filter((id) => ![1, 2].includes(id)))
                              }}
                            >
                              채널 접기 (In)
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 1: true })
                              }}
                            >
                              채널 확장 (Out)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 채널 2 그룹 - 동일한 로직 */}
                <Card className="border-purple-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 text-lg">
                          채널 2
                        </Badge>
                        <span className="text-lg text-gray-600">슬롯 3, 4</span>
                        {channelExtended[2] && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-lg">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            확장됨
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all ${channelExtended[2] ? "transform translate-x-6" : ""}`}
                    >
                      {slots
                        .filter((slot) => slot.channel === 2)\
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedSlots.includes(slot.id)
                                ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                                : scannedSlots.includes(slot.id)
                                  ? "border-green-500 bg-green-50 ring-2 ring-green-200 cursor-not-allowed"
                                  : testingSlots.includes(slot.id)
                                    ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200 cursor-not-allowed"
                                    : "hover:border-purple-300"
                            }`}
                            onClick={() => handleSlotClick(slot.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    testingSlots.includes(slot.id)
                                      ? "bg-yellow-500 text-white text-lg"
                                      : scannedSlots.includes(slot.id)
                                        ? "bg-green-500 text-white text-lg"
                                        : selectedSlots.includes(slot.id)
                                          ? "bg-blue-500 text-white text-lg"
                                          : getSlotStatusColor(slot.status) + " text-lg"
                                  }
                                >
                                  {testingSlots.includes(slot.id)
                                    ? slotTestStages[slot.id]?.stage || "검사중"
                                    : scannedSlots.includes(slot.id)
                                      ? "스캔 완료"
                                      : selectedSlots.includes(slot.id)
                                        ? "선택됨"
                                        : slot.status}
                                </Badge>
                                <span className="font-medium text-lg">슬롯 {slot.id}</span>
                              </div>
                            </div>

                            {testingSlots.includes(slot.id) && slotTestStages[slot.id] ? (
                              <div>
                                {slotTestStages[slot.id].stage === "검사 완료" && completedTestResults[slot.id] ? (
                                  // 검사 완료된 경우 결과 표시
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                      <div>
                                        <div className="text-sm text-gray-500">검사항목</div>
                                        <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">검체명</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].sampleName || "미입력"}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Chart ID</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].chartId || "미입력"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center p-4 border rounded-lg bg-gray-50">
                                      <div className="text-3xl font-bold text-blue-600 mb-2">
                                        {completedTestResults[slot.id].value} {completedTestResults[slot.id].unit}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`text-xl px-4 py-2 ${
                                          completedTestResults[slot.id].status === "정상"
                                            ? "bg-green-100 text-green-800 border-green-300"
                                            : completedTestResults[slot.id].status === "의심"
                                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                              : "bg-red-100 text-red-800 border-red-300"
                                        }`}
                                      >
                                        {completedTestResults[slot.id].status}
                                      </Badge>
                                    </div>
                                    <div className="space-y-2 text-lg">
                                      <div className="font-medium">결과 해석 범위:</div>
                                      <div className="grid grid-cols-1 gap-1">
                                        <div className="flex justify-between">
                                          <span className="text-green-600">정상:</span>
                                          <span>{completedTestResults[slot.id].ranges.정상}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-yellow-600">의심:</span>
                                          <span>{completedTestResults[slot.id].ranges.의심}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-red-600">비정상:</span>
                                          <span>{completedTestResults[slot.id].ranges.비정상}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-center p-2 border rounded-lg bg-blue-50">
                                      <div className="text-lg text-blue-800 font-medium">터치하여 슬롯 초기화</div>
                                    </div>
                                  </div>
                                ) : (
                                  // 검사 진행 중인 경우
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      <div>
                                        <div className="text-sm text-gray-500">검사항목</div>
                                        <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">검체명</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].sampleName || "미입력"}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Chart ID</div>
                                        <div className="text-lg font-medium">
                                          {slotTestStages[slot.id].chartId || "미입력"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-sm">
                                        {slotTestStages[slot.id].stage}
                                      </Badge>
                                      {(slotTestStages[slot.id].stage === "검사 진행중" ||
                                        slotTestStages[slot.id].stage === "분석중") && (
                                        <div className="text-xl font-mono font-bold text-blue-600">
                                          {formatTime(slotTestStages[slot.id].timeRemaining)}
                                        </div>
                                      )}
                                    </div>
                                    <Progress
                                      value={
                                        slotTestStages[slot.id].stage === "검사 완료"
                                          ? 100
                                          : slotTestStages[slot.id].stage === "분석중"
                                            ? 90
                                            : slotTestStages[slot.id].stage === "검사 진행중"
                                              ? 75
                                              : slotTestStages[slot.id].stage === "검체 투입중"
                                                ? 50
                                                : 25
                                      }
                                      className="h-3"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-lg text-gray-500 flex items-center justify-center h-16">
                                비어있음
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    {/* 채널 2 In/Out 컨트롤 */}
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 text-lg">
                            채널 2 상태
                          </Badge>
                          <Badge
                            variant={channelExtended[2] ? "outline" : "secondary"}
                            className={channelExtended[2] ? "bg-green-100 text-green-800 text-lg" : "text-lg"}
                          >
                            {channelExtended[2] ? "확장됨" : "접힘"}
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          {channelExtended[2] ? (
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 2: false })
                                setSelectedSlots(selectedSlots.filter((id) => ![3, 4].includes(id)))
                              }}
                            >
                              채널 접기 (In)
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 2: true })
                              }}
                            >
                              채널 확장 (Out)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {scanning && (
                <div className="p-6 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="font-medium text-blue-800 text-lg">
                        {scanProgress < 50
                          ? "구성품 스캔 중..."
                          : scanProgress < 100
                            ? "구성품 확인 중..."
                            : "구성품 확인 완료"}
                      </span>
                    </div>
                    <span className="text-lg text-blue-600">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-3" />
                </div>
              )}
            </div>
          </>
        )}

        {/* 검사 결과 탭 */}
        {activeTab === "results" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">검사 결과</h1>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="검체명 또는 Chart ID로 검색"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e)}
                      className="text-lg"
                    />
                  </div>
                  <Button size="lg">
                    <Search className="h-5 w-5 mr-2" />
                    검색
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-lg">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">번호</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">검체명</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Chart ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">슬롯 번호</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">검사항목</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Lot</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">결과</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">결과 해석</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentResults
                        .filter(
                          (result) =>
                            result.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            result.chartId.toLowerCase().includes(searchQuery.toLowerCase()),
                        )
                        .map((result, index) => (
                          <tr key={result.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{result.date}</td>
                            <td className="py-3 px-4">{result.patient}</td>
                            <td className="py-3 px-4 font-mono text-sm">{result.chartId}</td>
                            <td className="py-3 px-4">{result.slot}</td>
                            <td className="py-3 px-4">{result.test}</td>
                            <td className="py-3 px-4">{result.lot}</td>
                            <td className="py-3 px-4">
                              <span className={getResultColor(result.result)}>{result.result}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={getInterpretationColor(result.interpretation)}>
                                {result.interpretation}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* QC 탭 */}
        {activeTab === "qc" && !activeSubTab && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">QC</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <Settings className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">장비 Calibration</h3>
                  <p className="text-gray-600 mb-4">슬롯별 교정 진행</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("calibration")}>
                    시작하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <ClipboardCheck className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">슬롯 QC</h3>
                  <p className="text-gray-600 mb-4">슬롯별 점검 진행</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("slot-qc")}>
                    시작하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <FlaskConical className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">디바이스 QC</h3>
                  <p className="text-gray-600 mb-4">디바이스 점검 진행</p>
                  <Button
                    className="w-full text-lg py-3"
                    onClick={() => {
                      setDeviceQCMode(true)
                      setActiveTab("test")
                    }}
                  >
                    시작하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* QC - 장비 Calibration */}
        {activeTab === "qc" && activeSubTab === "calibration" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setActiveSubTab("")}>
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  뒤로
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">장비 Calibration</h1>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((slotId) => (
                  <Card key={slotId}>
                    <CardHeader>
                      <CardTitle className="text-xl">슬롯 {slotId} 교정</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">기준값</label>
                          <Input value="100.0" readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">오차율</label>
                          <Input value="±2%" readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">기존 UV data</label>
                          <Input value="98.5" readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">기존 Position (T/C)</label>
                          <Input value="50/50" readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">기존 모터 포지션</label>
                          <Input value="1250" readOnly className="bg-gray-50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">신규 UV data</label>
                          <Input placeholder="신규 값 입력" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">신규 Position (T/C)</label>
                          <Input placeholder="신규 값 입력" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">변경 값</label>
                          <Input placeholder="변경 값 입력" />
                        </div>
                      </div>
                      <Button className="w-full">교정 시작</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 장비 Calibration 결과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Calibration 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">번호</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">슬롯 번호</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">UV data</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Position (T/C)</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">QC 결과</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calibrationResults.map((result) => (
                          <tr key={result.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{result.id}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{result.date}</td>
                            <td className="py-3 px-4">{result.slot}</td>
                            <td className="py-3 px-4">{result.uvData}</td>
                            <td className="py-3 px-4">{result.position}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className={
                                  result.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }
                              >
                                {result.result}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* QC - 슬롯 QC */}
        {activeTab === "qc" && activeSubTab === "slot-qc" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setActiveSubTab("")}>
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  뒤로
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">슬롯 QC</h1>
              </div>
            </div>

            <div className="space-y-6">
              {/* 공통 온도 표시 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">공통 온도 상태</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium">시스템 온도</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">25°C</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((slotId) => (
                  <Card key={slotId}>
                    <CardHeader>
                      <CardTitle className="text-xl">슬롯 {slotId} 점검</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-medium mb-2">점검 결과</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>모터 동작:</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              정상
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>광학 센서:</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              정상
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full" onClick={handleSlotQCComplete}>
                        점검 시작
                      </Button>
                      <div className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                          <span className="text-sm text-blue-800">점검 진행 중... (30%)</span>
                        </div>
                        <Progress value={30} className="mt-2 h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 슬롯 QC 결과 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">슬롯 QC 결과</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-lg">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-500">번호</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">슬롯 번호</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">Lot</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-500">판정결과</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slotQCResults.map((result) => (
                          <tr key={result.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{result.id}</td>
                            <td className="py-3 px-4 text-gray-500 text-sm">{result.date}</td>
                            <td className="py-3 px-4">{result.slot}</td>
                            <td className="py-3 px-4">{result.lot}</td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className={
                                  result.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }
                              >
                                {result.result}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 디바이스 QC - 검사 탭과 동일한 UI */}
        {activeTab === "test" && deviceQCMode && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeviceQCMode(false)
                    setActiveTab("qc")
                    setActiveSubTab("device-qc")
                  }}
                >
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  뒤로
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">디바이스 QC</h1>
              </div>
              <Button className="text-lg py-3" onClick={handleNewTestStart}>
                <Play className="h-5 w-5 mr-3" />새 QC 시작
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-6">
                {/* 채널 1 그룹 */}
                <Card className="border-blue-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 text-lg">
                          채널 1
                        </Badge>
                        <span className="text-lg text-gray-600">슬롯 1, 2</span>
                        {channelExtended[1] && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-lg">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            확장됨
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all ${channelExtended[1] ? "transform translate-x-6" : ""}`}
                    >
                      {slots
                        .filter((slot) => slot.channel === 1)
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedSlots.includes(slot.id)
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                : scannedSlots.includes(slot.id)
                                  ? "border-green-500 bg-green-50 ring-2 ring-green-200 cursor-not-allowed"
                                  : testingSlots.includes(slot.id)
                                    ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200 cursor-not-allowed"
                                    : "hover:border-blue-300"
                            }`}
                            onClick={() => handleSlotClick(slot.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    testingSlots.includes(slot.id)
                                      ? "bg-yellow-500 text-white text-lg"
                                      : scannedSlots.includes(slot.id)
                                        ? "bg-green-500 text-white text-lg"
                                        : selectedSlots.includes(slot.id)
                                          ? "bg-blue-500 text-white text-lg"
                                          : getSlotStatusColor(slot.status) + " text-lg"
                                  }
                                >
                                  {testingSlots.includes(slot.id)
                                    ? slotTestStages[slot.id]?.stage || "QC 진행중"
                                    : scannedSlots.includes(slot.id)
                                      ? "스캔 완료"
                                      : selectedSlots.includes(slot.id)
                                        ? "선택됨"
                                        : slot.status}
                                </Badge>
                                <span className="font-medium text-lg">슬롯 {slot.id}</span>
                              </div>
                            </div>

                            {/* QC 모드에서는 판정 결과 없이 표시 */}
                            {testingSlots.includes(slot.id) && slotTestStages[slot.id] ? (
                              <div>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <div className="text-sm text-gray-500">검사항목</div>
                                      <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">검체명</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].sampleName || "미입력"}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Chart ID</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].chartId || "미입력"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-sm">
                                      {slotTestStages[slot.id].stage}
                                    </Badge>
                                    {(slotTestStages[slot.id].stage === "검사 진행중" ||
                                      slotTestStages[slot.id].stage === "분석중") && (
                                      <div className="text-xl font-mono font-bold text-blue-600">
                                        {formatTime(slotTestStages[slot.id].timeRemaining)}
                                      </div>
                                    )}
                                  </div>
                                  <Progress
                                    value={
                                      slotTestStages[slot.id].stage === "검사 완료"
                                        ? 100
                                        : slotTestStages[slot.id].stage === "분석중"
                                          ? 90
                                          : slotTestStages[slot.id].stage === "검사 진행중"
                                            ? 75
                                            : slotTestStages[slot.id].stage === "검체 투입중"
                                              ? 50
                                              : 25
                                    }
                                    className="h-3"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg text-gray-500 flex items-center justify-center h-16">
                                비어있음
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    {/* 채널 1 In/Out 컨트롤 */}
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 text-lg">
                            채널 1 상태
                          </Badge>
                          <Badge
                            variant={channelExtended[1] ? "outline" : "secondary"}
                            className={channelExtended[1] ? "bg-green-100 text-green-800 text-lg" : "text-lg"}
                          >
                            {channelExtended[1] ? "확장됨" : "접힘"}
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          {channelExtended[1] ? (
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 1: false })
                                setSelectedSlots(selectedSlots.filter((id) => ![1, 2].includes(id)))
                              }}
                            >
                              채널 접기 (In)
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 1: true })
                              }}
                            >
                              채널 확장 (Out)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 채널 2 그룹 - 동일한 로직 */}
                <Card className="border-purple-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 text-lg">
                          채널 2
                        </Badge>
                        <span className="text-lg text-gray-600">슬롯 3, 4</span>
                        {channelExtended[2] && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-lg">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            확장됨
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all ${channelExtended[2] ? "transform translate-x-6" : ""}`}
                    >
                      {slots
                        .filter((slot) => slot.channel === 2)
                        .map((slot) => (
                          <div
                            key={slot.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedSlots.includes(slot.id)
                                ? "border-purple-500 bg-purple-50 ring-2 ring-purple-200"
                                : scannedSlots.includes(slot.id)
                                  ? "border-green-500 bg-green-50 ring-2 ring-green-200 cursor-not-allowed"
                                  : testingSlots.includes(slot.id)
                                    ? "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200 cursor-not-allowed"
                                    : "hover:border-purple-300"
                            }`}
                            onClick={() => handleSlotClick(slot.id)}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    testingSlots.includes(slot.id)
                                      ? "bg-yellow-500 text-white text-lg"
                                      : scannedSlots.includes(slot.id)
                                        ? "bg-green-500 text-white text-lg"
                                        : selectedSlots.includes(slot.id)
                                          ? "bg-blue-500 text-white text-lg"
                                          : getSlotStatusColor(slot.status) + " text-lg"
                                  }
                                >
                                  {testingSlots.includes(slot.id)
                                    ? slotTestStages[slot.id]?.stage || "QC 진행중"
                                    : scannedSlots.includes(slot.id)
                                      ? "스캔 완료"
                                      : selectedSlots.includes(slot.id)
                                        ? "선택됨"
                                        : slot.status}
                                </Badge>
                                <span className="font-medium text-lg">슬롯 {slot.id}</span>
                              </div>
                            </div>

                            {/* QC 모드에서는 판정 결과 없이 표시 */}
                            {testingSlots.includes(slot.id) && slotTestStages[slot.id] ? (
                              <div>
                                <div className="space-y-3">
                                  <div className="grid grid-cols-3 gap-3">
                                    <div>
                                      <div className="text-sm text-gray-500">검사항목</div>
                                      <div className="text-lg font-medium">{slotTestStages[slot.id].itemName}</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">검체명</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].sampleName || "미입력"}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Chart ID</div>
                                      <div className="text-lg font-medium">
                                        {slotTestStages[slot.id].chartId || "미입력"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-sm">
                                      {slotTestStages[slot.id].stage}
                                    </Badge>
                                    {(slotTestStages[slot.id].stage === "검사 진행중" ||
                                      slotTestStages[slot.id].stage === "분석중") && (
                                      <div className="text-xl font-mono font-bold text-blue-600">
                                        {formatTime(slotTestStages[slot.id].timeRemaining)}
                                      </div>
                                    )}
                                  </div>
                                  <Progress
                                    value={
                                      slotTestStages[slot.id].stage === "검사 완료"
                                        ? 100
                                        : slotTestStages[slot.id].stage === "분석중"
                                          ? 90
                                          : slotTestStages[slot.id].stage === "검사 진행중"
                                            ? 75
                                            : slotTestStages[slot.id].stage === "검체 투입중"
                                              ? 50
                                              : 25
                                    }
                                    className="h-3"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="text-lg text-gray-500 flex items-center justify-center h-16">
                                비어있음
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                    {/* 채널 2 In/Out 컨트롤 */}
                    <div className="mt-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 text-lg">
                            채널 2 상태
                          </Badge>
                          <Badge
                            variant={channelExtended[2] ? "outline" : "secondary"}
                            className={channelExtended[2] ? "bg-green-100 text-green-800 text-lg" : "text-lg"}
                          >
                            {channelExtended[2] ? "확장됨" : "접힘"}
                          </Badge>
                        </div>
                        <div className="flex gap-3">
                          {channelExtended[2] ? (
                            <Button
                              size="lg"
                              variant="outline"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 2: false })
                                setSelectedSlots(selectedSlots.filter((id) => ![3, 4].includes(id)))
                              }}
                            >
                              채널 접기 (In)
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              onClick={() => {
                                setChannelExtended({ ...channelExtended, 2: true })
                              }}
                            >
                              채널 확장 (Out)
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {scanning && (
                <div className="p-6 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <span className="font-medium text-blue-800 text-lg">QC 구성품 스캔 중...</span>
                    </div>
                    <span className="text-lg text-blue-600">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-3" />
                </div>
              )}
            </div>
          </>
        )}

        {/* QC - 디바이스 QC 결과 */}
        {activeTab === "qc" && activeSubTab === "device-qc" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setActiveSubTab("")}>
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  뒤로
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">디바이스 QC 결과</h1>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">디바이스 QC 결과</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-lg">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">번호</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">날짜</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">슬롯 번호</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">검사 항목</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Lot</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">QC 결과</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deviceQCResults.map((result) => (
                        <tr key={result.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{result.id}</td>
                          <td className="py-3 px-4 text-gray-500 text-sm">{result.date}</td>
                          <td className="py-3 px-4">{result.slot}</td>
                          <td className="py-3 px-4">{result.test}</td>
                          <td className="py-3 px-4">{result.lot}</td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                result.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }
                            >
                              {result.result}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* 설정 탭 */}
        {activeTab === "settings" && !activeSubTab && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">설정</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <Settings className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">일반 설정</h3>
                  <p className="text-gray-600 mb-4">날짜/시간, 언어, 차트 연동</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("general")}>
                    설정하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <Users className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">사용자 관리</h3>
                  <p className="text-gray-600 mb-4">사용자 계정 관리</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("users")}>
                    관리하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-red-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <Lock className="h-12 w-12 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">관리자 비밀번호</h3>
                  <p className="text-gray-600 mb-4">관리자 비밀번호 관리</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("admin-password")}>
                    관리하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <Settings2 className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Maintenance</h3>
                  <p className="text-gray-600 mb-4">시스템 유지보수</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("maintenance")}>
                    시작하기
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 p-6 rounded-full mx-auto mb-4 w-fit">
                    <Activity className="h-12 w-12 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">업데이트</h3>
                  <p className="text-gray-600 mb-4">시스템 업데이트</p>
                  <Button className="w-full text-lg py-3" onClick={() => setActiveSubTab("update")}>
                    확인하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 설정 - 일반 설정 */}
        {activeTab === "settings" && activeSubTab === "general" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setActiveSubTab("")}>
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  뒤로
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">일반 설정</h1>
              </div>
            </div>

            <div className="space-y-6">
              {/* 날짜/시간 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">날짜/시간 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      variant={settings.dateTime.format === "24h" ? "default" : "outline"}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          dateTime: { ...settings.dateTime, format: "24h" },
                        })
                      }
                    >
                      24시간
                    </Button>
                    <Button
                      variant={settings.dateTime.format === "12h" ? "default" : "outline"}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          dateTime: { ...settings.dateTime, format: "12h" },
                        })
                      }
                    >
                      12시간
                    </Button>
                    <Button
                      variant={settings.dateTime.auto ? "default" : "outline"}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          dateTime: { ...settings.dateTime, auto: !settings.dateTime.auto },
                        })
                      }
                    >
                      자동 설정
                    </Button>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">현재 날짜/시간</label>
                    <Input
                      value={formatCurrentTime(currentTime, settings.dateTime.format)}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          dateTime: { ...settings.dateTime, current: e.target.value },
                        })
                      }
                      onKeyDown={(e) => handleKeyDown(e)}
                      disabled={settings.dateTime.auto}
                      className="text-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button>저장</Button>
                    <Button variant="outline">취소</Button>
                  </div>
                </CardContent>
              </Card>

              {/* 언어 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">언어 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">언어</label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => setSettings({ ...settings, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ko">한국어</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">글자 크기</label>
                      <Select
                        value={settings.fontSize}
                        onValueChange={(value) => setSettings({ ...settings, fontSize: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">작게</SelectItem>
                          <SelectItem value="medium">보통</SelectItem>
                          <SelectItem value="large">크게</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 차트 연동 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">차트 연동</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">차트 IP</label>
                      <Input
                        placeholder="192.168.1.100"
                        value={settings.chart.ip}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            chart: { ...settings.chart, ip: e.target.value },
                          })
                        }
                        onKeyDown={(e) => handleKeyDown(e)}
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">포트</label>
                      <Input
                        placeholder="8080"
                        value={settings.chart.port}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            chart: { ...settings.chart, port: e.target.value },
                          })
                        }
                        onKeyDown={(e) => handleKeyDown(e)}
                        className="text-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button>저장</Button>
                    <Button variant="outline">연동 확인</Button>
                  </div>
                </CardContent>
              </Card>

              {/* 프린터 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">프린터 설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">자동 인쇄</span>
                    <Switch
                      checked={settings.printer.autoPrint}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          printer: { ...settings.printer, autoPrint: checked },
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline">프린터 연결 확인</Button>
                    <Button>저장</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 설정 - 사용자 관리 */}
        {activeTab === "settings" && activeSubTab === "users" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setActiveSubTab("")}>
                  <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                  뒤로
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">사용자 관리</h1>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">등록된 사용자</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-lg font-medium">{user.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          비밀번호 변경
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          사용자 삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 구성품 장착 다이얼로그 */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">구성품 장착 가이드</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {/* 슬롯 선택 섹션 */}
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3 text-lg">선택된 슬롯</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {selectedSlots.map((slotId) => {
                  const slot = slots.find((s) => s.id === slotId)
                  return (
                    <Badge
                      key={slotId}
                      variant="outline"
                      className={`${slot?.channel === 1 ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"} cursor-pointer hover:bg-red-100 hover:text-red-800 text-lg py-2 px-4`}
                      onClick={() => setSelectedSlots(selectedSlots.filter((id) => id !== slotId))}
                    >
                      슬롯 {slotId} (채널 {slot?.channel}) ✕
                    </Badge>
                  )
                })}
              </div>

              {/* 채널별 일괄 선택 옵션 - 평행 배치 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 채널 1 */}
                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-blue-800">채널 1 (슬롯 1, 2)</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleChannelSelectAll(1)} className="text-sm">
                        전체 선택
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChannelDeselectAll(1)}
                        className="text-sm"
                      >
                        전체 해제
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {slots
                      .filter((slot) => slot.channel === 1)
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlots.includes(slot.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedSlots.includes(slot.id)) {
                              setSelectedSlots(selectedSlots.filter((id) => id !== slot.id))
                            } else {
                              setSelectedSlots([...selectedSlots, slot.id])
                            }
                          }}
                          disabled={scannedSlots.includes(slot.id) || testingSlots.includes(slot.id)}
                          className="text-sm flex-1"
                        >
                          슬롯 {slot.id}
                        </Button>
                      ))}
                  </div>
                </div>

                {/* 채널 2 */}
                <div className="border rounded-lg p-4 bg-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-medium text-purple-800">채널 2 (슬롯 3, 4)</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleChannelSelectAll(2)} className="text-sm">
                        전체 선택
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChannelDeselectAll(2)}
                        className="text-sm"
                      >
                        전체 해제
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {slots
                      .filter((slot) => slot.channel === 2)
                      .map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlots.includes(slot.id) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedSlots.includes(slot.id)) {
                              setSelectedSlots(selectedSlots.filter((id) => id !== slot.id))
                            } else {
                              setSelectedSlots([...selectedSlots, slot.id])
                            }
                          }}
                          disabled={scannedSlots.includes(slot.id) || testingSlots.includes(slot.id)}
                          className="text-sm flex-1"
                        >
                          슬롯 {slot.id}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 구성품 장착 애니메이션 */}
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="flex justify-center mb-4">
                <div className="relative w-64 h-64 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center bg-white overflow-hidden">
                  {/* 슬롯 베이스 (위에서 보는 형태) */}
                  <div className="absolute w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                    {/* 슬롯 구멍들 - 수직 배열 */}
                    <div className="w-16 h-16 rounded-full border-2 border-gray-400 mb-6"></div>
                    <div className="w-12 h-12 rounded-full border-2 border-gray-400 mb-6"></div>
                    <div className="w-20 h-10 rounded-md border-2 border-gray-400"></div>
                  </div>

                  {/* 디바이스 장착 애니메이션 (위에서 첫 번째) */}
                  <div
                    className="absolute top-[20%] transform -translate-y-1/2 w-14 h-14 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0s" }}
                  >
                    <div className="text-sm text-center mt-4 text-white font-bold">디바이스</div>
                  </div>

                  {/* 팁 장착 애니메이션 (두 번째) */}
                  <div
                    className="absolute top-[50%] transform -translate-y-1/2 w-10 h-10 bg-yellow-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <div className="text-sm text-center mt-3 text-white font-bold">팁</div>
                  </div>

                  {/* 버퍼 카트리지 장착 애니메이션 (세 번째) */}
                  <div
                    className="absolute top-[80%] transform -translate-y-1/2 w-16 h-8 bg-green-400 rounded-md animate-ping"
                    style={{ animationDelay: "1s", animationDuration: "2s" }}
                  >
                    <div className="text-sm text-center mt-2 text-white font-bold">버퍼</div>
                  </div>

                  {/* 장착 순서 표시 화살표 */}
                  <div className="absolute right-4 h-full flex flex-col items-center justify-center">
                    <div className="text-sm font-bold mb-2">장착 순서</div>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-400 mb-1"></div>
                      <div className="w-1 h-4 bg-gray-400"></div>
                      <div className="w-4 h-4 rounded-full bg-yellow-400 mb-1"></div>
                      <div className="w-1 h-4 bg-gray-400"></div>
                      <div className="w-4 h-4 rounded-md bg-green-400"></div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">위에서 보는 장착 애니메이션</div>
                </div>
              </div>
              <div className="space-y-3 text-center">
                <h3 className="font-medium text-lg">구성품 장착 방법</h3>
                <ol className="text-lg text-gray-600 text-left list-decimal pl-6 space-y-2">
                  <li>메인 디바이스, 팁, 버퍼 카트리지를 상단 슬롯에 수직으로 삽입합니다.</li>
                  <li>모든 구성품이 제자리에 고정되었는지 확인합니다.</li>
                  <li>선택된 모든 슬롯에 대해 위 과정을 반복합니다.</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelInstall} className="text-lg py-3 px-6">
              취소
            </Button>
            <Button onClick={handleInstallComplete} className="text-lg py-3 px-6">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 검체 투입 다이얼로그 */}
      <Dialog open={showSampleInputDialog} onOpenChange={setShowSampleInputDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{deviceQCMode ? "QC 샘플 투입" : "검체 투입"}</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6">
              <h3 className="font-medium mb-4 text-lg">스캔된 구성품 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scannedSlots.map((slotId) => (
                  <Card key={slotId} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 text-lg">
                          슬롯 {slotId}
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-800 text-lg">
                          스캔 완료
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm text-gray-500">검출된 아이템</div>
                          <div className="text-lg font-medium">{deviceQCMode ? "QC Kit" : "ANA Kit"}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">검체 종류</div>
                          <div className="text-lg font-medium">혈청</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">필요 검체량</div>
                          <div className="text-lg font-medium text-blue-600">50-100 μL</div>
                        </div>
                      </div>

                      {/* 검체 정보 입력 필드 */}
                      <div className="space-y-3 pt-4 border-t">
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">검체명</label>
                          <Input
                            placeholder="검체명 입력"
                            value={sampleInfo[slotId]?.sampleName || ""}
                            onChange={(e) =>
                              setSampleInfo((prev) => ({
                                ...prev,
                                [slotId]: { ...prev[slotId], sampleName: e.target.value },
                              }))
                            }
                            onKeyDown={(e) => handleKeyDown(e)}
                            className="text-lg"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-500 block mb-1">Chart ID</label>
                          <Input
                            placeholder="Chart ID 입력"
                            value={sampleInfo[slotId]?.chartId || ""}
                            onChange={(e) =>
                              setSampleInfo((prev) => ({
                                ...prev,
                                [slotId]: { ...prev[slotId], chartId: e.target.value },
                              }))
                            }
                            onKeyDown={(e) => handleKeyDown(e)}
                            className="text-lg"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="text-sm text-yellow-800 font-medium">
                          ⚠️ 검체를 슬롯 {slotId}에 투입해 주세요
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 text-base">검체 투입 안내</h4>
              <ul className="text-base text-blue-800 space-y-1">
                <li>• 각 슬롯에 표시된 검체량만큼 정확히 투입해 주세요</li>
                <li>• 검체명과 Chart ID를 입력해 주세요 (선택사항)</li>
                <li>• 검체 투입 후 검사 진행 버튼을 눌러주세요</li>
                <li>• 검사 시작 후에는 취소할 수 없습니다</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancelTest} className="text-lg py-3 px-6">
              검사 취소
            </Button>
            <Button onClick={handleStartTest} className="text-lg py-3 px-6">
              검사 진행
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
