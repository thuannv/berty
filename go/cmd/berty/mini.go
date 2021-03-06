package main

import (
	"context"
	"flag"

	"berty.tech/berty/v2/go/cmd/berty/mini"
	"github.com/peterbourgon/ff/v3/ffcli"
)

func miniCommand() *ffcli.Command {
	var (
		fs        = flag.NewFlagSet("berty mini", flag.ExitOnError)
		groupFlag string
	)
	fs.StringVar(&groupFlag, "mini.group", groupFlag, "group to join, leave empty to create a new group")
	manager.SetupLocalMessengerServerFlags(fs)
	manager.SetupRemoteNodeFlags(fs)

	return &ffcli.Command{
		Name:       "mini",
		ShortHelp:  "start a terminal-based mini berty client (not fully compatible with the app)",
		ShortUsage: "berty [global flags] mini [flags]",
		FlagSet:    fs,
		Exec: func(ctx context.Context, args []string) error {
			// mini only supports file-based logging
			if manager.Logging.Logfile == "" {
				manager.Logging.Filters = ""
			}

			// logger
			logger, err := manager.GetLogger()
			if err != nil {
				return err
			}
			miniLogger := logger.Named("mini")

			// messenger client
			messengerClient, err := manager.GetMessengerClient()
			if err != nil {
				return err
			}

			// protocol client
			protocolClient, err := manager.GetProtocolClient()
			if err != nil {
				return err
			}

			return mini.Main(ctx, &mini.Opts{
				GroupInvitation: groupFlag,
				MessengerClient: messengerClient,
				ProtocolClient:  protocolClient,
				Logger:          miniLogger,
				DisplayName:     manager.Node.Messenger.DisplayName,
			})
		},
	}
}
