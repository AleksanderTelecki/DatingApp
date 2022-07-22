export interface Message{
    id: number
    senderId: number
    senderUsername: string
    senderPhotoUrl: string
    recepientId: number
    recepientUsername: string
    recepientPhotoUrl: string
    content: string
    dateRead: Date
    messageSent: Date
    senderDeleted: boolean
    recepientDeleted: boolean
}