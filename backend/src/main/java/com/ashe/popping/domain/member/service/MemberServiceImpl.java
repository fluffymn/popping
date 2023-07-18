package com.ashe.popping.domain.member.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ashe.popping.api.member.dto.MemberDto;
import com.ashe.popping.domain.member.entity.Member;
import com.ashe.popping.domain.member.repository.MemberRepository;
import com.ashe.popping.global.error.ErrorCode;
import com.ashe.popping.global.error.exception.BusinessException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

	private final MemberRepository memberRepository;

	@Override
	public MemberDto getMemberByMemberId(Long memberId) {
		Member member = memberRepository.findByMemberId(memberId);

		return MemberDto.from(member);
	}

	@Override
	@Transactional
	public MemberDto updateMember(MemberDto memberDto) {
		Member member = memberRepository.findByMemberId(memberDto.getMemberId());

		member.updateNickname(memberDto.getNickname());

		return MemberDto.from(member);
	}

	@Override
	public void validateDuplicateMember(MemberDto memberDto) {
		Member member = Member.from(memberDto);
		Optional<Member> optionalMember = memberRepository.findByKakaoId(member.getKakaoId());
		if (optionalMember.isPresent()) {
			throw new BusinessException(ErrorCode.ALREADY_REGISTERED_MEMBER);
		}
	}

	@Override
	public Optional<Member> findByKakaoId(String kakaoId) {
		return memberRepository.findByKakaoId(kakaoId);
	}

	@Override
	public MemberDto createMember(MemberDto memberDto) {
		Member member = Member.from(memberDto);

		memberRepository.save(member);

		return MemberDto.from(member);
	}
}
