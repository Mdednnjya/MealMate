"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Breadcrumbs from '@/components/breadcrumbs';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
    id: string;
    type: 'REQUEST_RECEIVED' | 'REQUEST_REJECTED' | 'REQUEST_ACCEPTED' | 'REQUEST_APPROVED';
    created_at: string;
    donation_id: string;
    is_read: boolean;
    sender: {
        name: string;
    };
    donations: {
        title: string;
    };
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const supabase = createClientComponentClient();

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('notifications')
            .select(`
               *,
               sender:profiles!sender_id (name),
               donations (title)
           `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(6);

        if (error) {
            console.error('Error fetching notifications:', error);
        } else {
            setNotifications(data);
        }
    };

    const handleNotificationClick = async (notificationId: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) {
            console.error('Error marking notification as read:', error);
        } else {
            // Update local state to reflect the change
            setNotifications(notifications.map(notif =>
                notif.id === notificationId ? { ...notif, is_read: true } : notif
            ));
        }
    };

    const handleAccept = async (notificationId: string, donationId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error: updateError } = await supabase
            .from('requests')
            .update({ status: 'ACCEPTED' })
            .eq('donation_id', donationId)
            .eq('user_id', user.id);

        if (updateError) {
            console.error('Error accepting request:', updateError);
            return;
        }

        const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
                user_id: user.id,
                sender_id: user.id,
                donation_id: donationId,
                type: 'REQUEST_ACCEPTED',
            });

        if (notificationError) {
            console.error('Error creating notification:', notificationError);
        }

        const { error: updateNotificationError } = await supabase
            .from('notifications')
            .update({ type: 'REQUEST_APPROVED' })
            .eq('id', notificationId);

        if (updateNotificationError) {
            console.error('Error updating notification:', updateNotificationError);
        }

        // Refresh notifications
        fetchNotifications();
    };

    const renderNotification = (notification: Notification) => {
        const { type, sender, donations, created_at, is_read } = notification;

        const renderContent = () => {
            switch (type) {
                case 'REQUEST_RECEIVED':
                    return (
                        <>
                            <p>{`${sender.name} is interested in your donation titled ${donations.title}. Please review the request and respond at your earliest convenience.`}</p>
                            <div className="flex space-x-2 mt-2">
                                <button onClick={() => handleAccept(notification.id, notification.donation_id)} className="bg-black text-white px-4 py-2 rounded">
                                    Accept
                                </button>
                                <Link href={`/manage/your-donations/${notification.donation_id}`}>
                                    <button className="bg-gray-200 text-black px-4 py-2 rounded">See Details</button>
                                </Link>
                            </div>
                        </>
                    );
                case 'REQUEST_REJECTED':
                    return (
                        <p>{`${sender.name} has rejected your request for the donation titled ${donations.title}. Please try requesting another available donation.`}</p>
                    );
                case 'REQUEST_ACCEPTED':
                    return (
                        <p>{`${sender.name} has accepted your request for the donation titled ${donations.title}. Please coordinate with phone number for further details.`}</p>
                    );
                case 'REQUEST_APPROVED':
                    return (
                        <p>{`You approved the donation titled ${donations.title} requested by ${sender.name}. Please coordinate by call or text for more coordination.`}</p>
                    );
            }
        };

        return (
            <div
                key={notification.id}
                className={`flex items-start space-x-4 mb-4 ${is_read ? 'opacity-60' : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
            >
                <Image
                    src={type === 'REQUEST_APPROVED' ? "/images/notifications/checkmark.png" : "/images/default-profile.png"}
                    alt="Notification Icon"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <div className="flex-1">
                    {renderContent()}
                    <p className="text-sm text-gray-500">{formatDistanceToNow(new Date(created_at))} ago</p>
                </div>
                {!is_read && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Home', href: '/'},
                    {label: 'Notifications', href: '/notifications', active: true},
                ]}
            />
            <div className="bg-white rounded-lg shadow-lg p-6 mt-4">
                <h1 className="text-2xl font-bold mb-4">Notifications</h1>
                <h2 className="text-lg mb-4">Newest</h2>
                <div>
                    {notifications.map(renderNotification)}
                </div>
            </div>
        </div>
    );
}
