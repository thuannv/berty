import React from 'react'
import { View, ScrollView, Share, Image } from 'react-native'
import { Layout, Text } from 'react-native-ui-kitten'
import { useStyles } from '@berty-tech/styles'
import {
	ButtonSetting,
	FactionButtonSetting,
	ButtonSettingRow,
} from '../shared-components/SettingsButtons'
import { ProceduralCircleAvatar } from '../shared-components/ProceduralCircleAvatar'
import HeaderSettings from '../shared-components/Header'
import { useNavigation, ScreenProps } from '@berty-tech/navigation'
import { useConversation, useMsgrContext } from '@berty-tech/store/hooks'
import AvatarGroup19 from '../main/Avatar_Group_Copy_19.png'

//
// GroupChatSettings
//

// Styles
const useStylesChatSettings = () => {
	const [{ margin, height }] = useStyles()
	return {
		firstHeaderButton: [margin.right.scale(20), height(90)],
		secondHeaderButton: [margin.right.scale(20), height(90)],
		thirdHeaderButton: height(90),
	}
}

const GroupChatSettingsHeaderButtons: React.FC<any> = ({ link, publicKey }) => {
	const { navigate } = useNavigation()
	const _styles = useStylesChatSettings()
	const [{ padding, margin, color }] = useStyles()
	return (
		<View style={[padding.top.medium, margin.top.medium]}>
			<ButtonSettingRow
				state={[
					{
						name: 'Search',
						icon: 'search-outline',
						color: color.blue,
						style: _styles.firstHeaderButton,
						disabled: true,
					},
					{
						name: 'Call',
						icon: 'phone-outline',
						color: color.green,
						style: _styles.secondHeaderButton,
						disabled: true,
					},
					{
						name: 'Share',
						icon: 'upload',
						color: color.blue,
						style: _styles.thirdHeaderButton,
						disabled: !link || undefined,
						onPress: link ? () => navigate.chat.multiMemberQR({ convId: publicKey }) : undefined,
					},
				]}
			/>
		</View>
	)
}

const GroupChatSettingsHeader: React.FC<messenger.conversation.Entity> = ({
	displayName,
	publicKey,
}) => {
	const [{ text, margin, row }, { scaleHeight }] = useStyles()
	return (
		<View>
			<View style={[row.center]}>
				<Image source={AvatarGroup19} style={{ width: 80, height: 80 }} />
			</View>
			<Text
				numberOfLines={1}
				ellipsizeMode='tail'
				style={[text.align.center, text.color.white, margin.top.small, text.bold.medium]}
			>
				{displayName || ''}
			</Text>
		</View>
	)
}

const MultiMemberSettingsBody: React.FC<any> = ({ publicKey, link }) => {
	const [{ padding, margin, color }] = useStyles()
	const ctx: any = useMsgrContext()
	const pk = publicKey
	const members = ctx.members[pk] || {}
	return (
		<View style={[padding.medium]}>
			<ButtonSetting name='Medias, links & docs' icon='image-outline' disabled />
			<ButtonSetting name='Receive notifications' icon='bell-outline' toggled disabled />
			<FactionButtonSetting
				name='Members'
				icon='users'
				iconPack='custom'
				state={{
					value: `${Object.values(members).length} members`,
					color: color.blue,
					bgColor: color.light.blue,
				}}
				style={[margin.top.medium]}
			>
				{Object.entries(members).map(([k, v]) => {
					return (
						<ButtonSetting
							style={[padding.horizontal.small]}
							name={`${(members && members[k].displayName) || 'Unknown'}: ${members[k].publicKey}`}
							// image={seed}
							// previewValue="Me"
							// previewValueColor={color.blue}
							// state={{ value: 'Not a contact', color: color.grey, bgColor: color.light.grey }}
							alone={false}
						/>
					)
				})}
			</FactionButtonSetting>
			<ButtonSetting name='Add member' icon='user-plus' iconPack='custom' disabled />
			<ButtonSetting
				name='Invite by link'
				icon='attach-outline'
				onPress={
					link
						? async () => {
								try {
									await Share.share({ url: link })
								} catch (e) {
									console.error(e)
								}
						  }
						: undefined
				}
				disabled={!link || undefined}
			/>
			<ButtonSetting
				name='Erase conversation'
				icon='message-circle-outline'
				iconColor={color.red}
				disabled
			/>
			<ButtonSetting name='Leave group' icon='log-out-outline' iconColor={color.red} disabled />
		</View>
	)
}

export const MultiMemberSettings: React.FC<ScreenProps.Chat.MultiMemberSettings> = ({ route }) => {
	const { convId } = route.params
	const conv = useConversation(convId)
	const { goBack } = useNavigation()
	const [{ flex, padding }] = useStyles()

	if (!conv) {
		goBack()
		return null
	}
	return (
		<Layout style={[flex.tiny]}>
			<ScrollView contentContainerStyle={[padding.bottom.huge]} bounces={false}>
				<HeaderSettings actionIcon='edit-outline' undo={goBack}>
					<View>
						<GroupChatSettingsHeader {...conv} />
						<GroupChatSettingsHeaderButtons {...conv} />
					</View>
				</HeaderSettings>
				<MultiMemberSettingsBody {...conv} />
			</ScrollView>
		</Layout>
	)
}
