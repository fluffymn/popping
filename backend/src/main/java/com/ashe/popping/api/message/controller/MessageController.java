package com.ashe.popping.api.message.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ashe.popping.api.message.dto.MessageApiDto;
import com.ashe.popping.domain.message.dto.MessageDto;
import com.ashe.popping.domain.message.service.MessageService;
import com.ashe.popping.global.resolver.memberinfo.MemberInfo;
import com.ashe.popping.global.resolver.memberinfo.MemberInfoDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {
	private final MessageService messageService;

	@PostMapping
	public ResponseEntity<MessageApiDto.Response> sendMessage(@RequestBody MessageApiDto.Request request) {
		MessageDto messageDto = messageService.saveMessage(MessageDto.from(request));
		return ResponseEntity.ok(MessageApiDto.Response.from(messageDto));
	}

	@GetMapping("/me/sent")
	public ResponseEntity<List<MessageApiDto.Response>> getSentMessages(@MemberInfo MemberInfoDto
		memberInfoDto) {
		Long memberId = memberInfoDto.getMemberId();
		List<MessageDto> messages = messageService.loadSendMessage(memberId);
		return ResponseEntity.ok(toMessageResponse(messages));
	}

	@GetMapping("/me/received")
	public ResponseEntity<List<MessageApiDto.Response>> getReceivedMessage(@MemberInfo MemberInfoDto memberInfoDto) {
		Long memberId = memberInfoDto.getMemberId();
		List<MessageDto> messages = messageService.loadReceiveMessage(memberId);
		return ResponseEntity.ok(toMessageResponse(messages));
	}

	@PatchMapping("/{messageId}")
	public ResponseEntity<?> readMessage(@PathVariable Long messageId) {
		messageService.updateMessageStateToRead(messageId);
		return ResponseEntity.ok(null);
	}

	private static List<MessageApiDto.Response> toMessageResponse(List<MessageDto> messages) {
		return messages.stream()
			.map(MessageApiDto.Response::from)
			.toList();
	}

}
